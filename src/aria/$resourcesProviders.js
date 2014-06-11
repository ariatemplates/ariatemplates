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

var Aria = require("./Aria");
var Promise = require("noder-js/promise");
var asyncRequire = require("noder-js/asyncRequire").create(module);

/**
 * Contains the instances of resources providers that have been created. They are inedexed by using a combination of the
 * arguments passed to the "fetch" method
 * @type Object
 * @private
 */
var providersStore = {};

/**
 * Compute the key that will be used to store a certain instance of provider in the providers store
 * @param {Object} args
 * @return {String}
 * @private
 */
var computeKeyFromArgs = function (args) {
    var output = [args.provider, args.caller];
    if (args.onLoad) {
        output.push(args.onLoad);
    }
    if (args.handler) {
        output.push(args.handler);
    }
    if (args.resources) {
        output.push(args.resources.join("-"));
    }
    return output.join("-");
};

/**
 * @param {Object} args arguments passed to the "fetch" method
 * @param {Object} instance instance of the provider
 * @private
 */
var addInstanceToStore = function (args, instance) {
    providersStore[computeKeyFromArgs(args)] = instance;
};

/**
 * @param {Object} args arguments passed to the "fetch" method
 * @return {Object} instance of the provider
 * @private
 */
var getInstanceFromStore = function (args) {
    return providersStore[computeKeyFromArgs(args)];
};

/**
 * Add "getData" method on every provider instance
 * @param {Object} instance instance of the provider
 * @param {String} classpath classpath of the class depending on this resource provider
 * @private
 */
var createGetData = function (instance, classpath) {
    instance.getData = function () {
        return instance.__getData(classpath);
    };
};

/**
 * @param {String} referencePath if not specified, the fist argument will be the baseLogicalPath
 * @param {String} baseLogicalPath
 * @return {String} resolved path of the resource
 * @private
 */
var resolveBaseLogicalPathResource = function (referencePath, baseLogicalPath) {
    if (!baseLogicalPath) {
        baseLogicalPath = referencePath;
        referencePath = "";
    }
    var path = baseLogicalPath.split("/");
    if (referencePath && (path[0] == "." || path[0] == "..")) {
        path = referencePath.split("/").concat(path);
    }
    for (var i = 0, l = path.length; i < l; i++) {
        if (path[i] == ".") {
            path.splice(i, 1);
            i--;
        } else if (i > 0 && path[i] == ".." && path[i - 1] != "..") {
            i--;
            path.splice(i, 2);
            i--;
        }
    }
    return path.join("/");
};

/**
 * Convert the array of arguments into an object
 * @private
 * @param {Array} args list of arguments. It has the following structure
 *
 * <pre>
 * [
 *     referencePath,
 *     baseLogicalPath,
 *     classpath of the calling class,
 *     onLoad,
 *     handler,
 *     resource1,
 *     resource2,
 *     ...
 * ]
 * </pre>
 *
 * @return {Object} arguments as an object. It has the following structure
 *
 * <pre>
 * {
 *     provider : path of the provider,
 *     caller : classpath of the caller,
 *     onLoad : onLoad method of the caller prototype to call after the resources are fetched,
 *     handler : handler,
 *     resurces : [resA, resB, ...]
 * }
 * </pre>
 */
var convertArguments = function (args) {
    var argsLength = args.length;
    var convertedArgs = {
        provider : resolveBaseLogicalPathResource(args[0], args[1]),
        caller : args[2]
    };
    if (argsLength > 3) {
        convertedArgs.onLoad = args[3];
    }
    if (argsLength > 4) {
        convertedArgs.handler = args[4];
    }
    if (argsLength > 5) {
        var resources = [];
        for (var i = 5; i < argsLength; i++) {
            resources.push(args[i]);
        }
        convertedArgs.resources = resources;
    }
    return convertedArgs;
};

/**
 * Public method that has to be used to obtain the instance of provider
 * @param {String} referencePath reference path of the provider module
 * @param {String} baseLogicalPath path of the provider module
 * @param {String} callerClasspath classpath of the caller,
 * @param {String} onLoad onLoad method of the caller prototype to call after the resources are fetched
 * @param {String} handler handler
 * @param {...*} var_args flattened list of resources
 * @return {Object} It contains a property "provider" whose value is the instance of the provider
 * @public
 */
var fetch = function (referencePath, baseLogicalPath, callerClasspath, onLoad, handler) {
    var args = convertArguments(arguments);
    if (args.onLoad) {
        asyncRequire(args.provider).spreadSync(function (providerConstr) {
            return fetchDataAfterLoading(providerConstr, args);
        }).then(function () {
            var callerPrototype = Aria.getClassRef(args.caller).prototype;
            callerPrototype[args.onLoad].call(callerPrototype);
        }).done();
    }
    return {
        provider : getInstanceFromStore(args)
    };
};

/**
 * Create an instance of the contructor, set the handler and the resources, call the fetch method
 * @param {Function} providerConstr contructor of the provider
 * @param {Object} args see the value returned by "convertArguments" method
 * @return {Object} promise
 */
var fetchDataAfterLoading = function (providerConstr, args) {
    return new Promise(function (resolve) {
        var instance = new providerConstr();
        addInstanceToStore(args, instance);
        createGetData(instance, args.caller);
        if (args.hasOwnProperty("handler")) {
            instance.setHandler(args.handler);
        }
        if (args.hasOwnProperty("resources")) {
            instance.setResources(args.resources);
        }
        instance.fetchData(resolve, args.caller);
    });
};

/**
 * Preload the provider module. If "onLoad" is not present, then it also fetches the resources of the provider
 * @return {Object} promise
 */
fetch.$preload = function () {
    var args = convertArguments(arguments);
    var loadPromise = asyncRequire(args.provider);
    if (args.onLoad) {
        return loadPromise;
    } else {
        return loadPromise.spreadSync(function (providerConstr) {
            return fetchDataAfterLoading(providerConstr, args);
        });
    }

};

module.exports = {
    fetch : fetch
};
