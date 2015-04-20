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

var resMgr = require("./core/ResMgr");

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

var loadResource = function (serverResource, referencePath, staticFile) {
    return resMgr.loadResource(serverResource, resolveBaseLogicalPathResource(referencePath, staticFile));
};

var loadResourceModule = function (serverResource, referencePath, staticFile) {
    var baseLogicalPath = resolveBaseLogicalPathResource(referencePath, staticFile);
    var res = resMgr.getResource(baseLogicalPath);
    if (!res) {
        // even if that resource is not yet loaded, maybe it can be loaded synchronously
        var promise = resMgr.loadResource(serverResource, baseLogicalPath);
        if (promise.isFulfilled()) {
            res = promise.result();
        } else {
            throw new Error("Resource " + serverResource + "," + referencePath + "," + staticFile
                    + " is not yet loaded.");
        }
    }
    return res;
};

loadResourceModule.$preload = loadResource;

var loadResourceFile = function (reference, staticFile) {
    return loadResourceModule(null, reference, staticFile);
};

loadResourceFile.$preload = function (reference, staticFile) {
    return loadResource(null, reference, staticFile);
};

module.exports = {
    module : loadResourceModule,
    file : loadResourceFile,
    unload : function (referencePath, staticFile, cleanCache, timestampNextTime, onlyIfError) {
        var baseLogicalPath = resolveBaseLogicalPathResource(referencePath, staticFile);
        return resMgr.unloadResource(baseLogicalPath, cleanCache, timestampNextTime, onlyIfError);
    }
};
