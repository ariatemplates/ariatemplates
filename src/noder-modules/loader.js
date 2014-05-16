/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var promise = require('noder-js/promise');
var request = require('noder-js/request');
var typeUtils = require('noder-js/type');
var findRequires = require('noder-js/findRequires');
var scriptBaseUrl = require('noder-js/scriptBaseUrl');
var ParentLoader = require('noder-js/loader');
var bind1 = require('noder-js/bind1');

var bind = function (fn, scope) {
    return function () {
        return fn.apply(scope, arguments);
    };
};

var tplFileNameRegExp = /\.(tpl(\.css|\.txt)?|cml|tml)$/;
var oldATClassRegExp = /Aria\s*\.\s*(class|interface|bean|tplScript)Definition(s?)\s*\(/;
var downloadMgrPath = "ariatemplates/core/DownloadMgr";
var oldATLoaderPath = "ariatemplates/core/loaders/OldATLoader";

var Loader = function (context) {
    var config = context.config.packaging || {};
    var ariatemplates = config.ariatemplates;
    if (!ariatemplates) {
        return new ParentLoader(context);
    }
    if (!context.config.packaging) {
        context.config.packaging = config;
    }
    var Aria = global.Aria || {};
    global.Aria = Aria;
    if (Aria.rootFolderPath == null && config.baseUrl == null) {
        var rootFolderPath = scriptBaseUrl();
        rootFolderPath = rootFolderPath.replace(/\/aria(templates)?\/$/, "/");
        Aria.rootFolderPath = config.baseUrl = rootFolderPath;
    } else if (Aria.rootFolderPath == null) {
        Aria.rootFolderPath = config.baseUrl;
    } else if (config.baseUrl == null) {
        config.baseUrl = Aria.rootFolderPath;
    }
    var preprocessors = config.preprocessors;
    if (!preprocessors) {
        config.preprocessors = preprocessors = [];
    }
    preprocessors.push({
        pattern : tplFileNameRegExp,
        module : "ariatemplates/core/loaders/GeneralTplPreprocessor"
    });
    this.parentLoader = new ParentLoader(context);
    this.parentLoadUnpackaged = bind(this.parentLoader.loadUnpackaged, this.parentLoader);
    this.parentLoader.loadUnpackaged = bind(this.loadUnpackaged, this);
    this.parentLoader.defineUnpackaged = bind(this.defineUnpackaged, this);

    this.context = context;
};

var LoaderProto = Loader.prototype = {};

LoaderProto.moduleLoad = function (module) {
    return this.parentLoader.moduleLoad(module);
};

LoaderProto.isDownloadMgrUsable = function () {
    if (!this.downloadMgr) {
        var context = this.context;
        this.downloadMgr = context.getModule(context.moduleResolve(context.rootModule, downloadMgrPath));
    }
    return this.downloadMgr.loaded;
};

LoaderProto.downloadModule = function (module) {
    var deferred = promise.defer();
    var logicalPath = module.filename;
    var downloadMgr = this.downloadMgr.exports;
    module.url = downloadMgr.resolveURL(logicalPath, true);
    downloadMgr.loadFile(logicalPath, {
        scope : this,
        fn : function () {
            var fileContent = downloadMgr.getFileContent(logicalPath);
            if (fileContent == null) {
                deferred.reject(new Error("Error while downloading " + logicalPath));
            } else {
                deferred.resolve(fileContent);
            }
        }
    });
    return deferred.promise;
};

// first entry point: if it is present, use the DownloadMgr to download files
LoaderProto.loadUnpackaged = function (module) {
    if (this.isDownloadMgrUsable()) {
        return this.downloadModule(module).then(bind1(this.parentLoader.preprocessUnpackaged, this.parentLoader, module));
    } else {
        return this.parentLoadUnpackaged(module);
    }
};

// second entry point: process old AT classes if needed
LoaderProto.defineUnpackaged = function (module, fileContent) {
    var context = this.context;
    var newSyntax = !tplFileNameRegExp.test(module.filename); // templates still use the old syntax
    if (newSyntax) {
        var dependencies = findRequires(fileContent, true);
        // classes containing require or without Aria.xDefinition are using the new syntax
        newSyntax = dependencies.length > 0 || !oldATClassRegExp.test(fileContent);
        if (newSyntax) {
            var definition = context.jsModuleEval(fileContent, module.url);
            context.moduleDefine(module, dependencies, definition);
            return;
        }
    }
    // old syntax, let's delegate the work to the old loader
    var oldATLoader = this.oldATLoader;
    if (oldATLoader) {
        return oldATLoader(module, fileContent);
    } else {
        var self = this;
        return context.moduleAsyncRequire(context.rootModule, [oldATLoaderPath]).thenSync(function (oldATLoader) {
            self.oldATLoader = oldATLoader;
            return oldATLoader(module, fileContent);
        });
    }
};

module.exports = Loader;
