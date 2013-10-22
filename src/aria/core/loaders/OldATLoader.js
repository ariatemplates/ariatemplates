/*
 * Copyright 2013 Amadeus s.a.s.
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

var Aria = require('../../Aria.js');
var promise = require('noder-js/promise.js');
var currentContext = require('noder-js/currentContext.js');

module.exports = function (module, content) {
    var defer = promise.defer();
    var savedValue = Aria.$oldModuleLoader;
    try {
        Aria.$oldModuleLoader = {
            logicalPath : module.filename,
            continueLoading : function (dependencies, loadCallback) {
                if (dependencies.length === 0) {
                    module.exports = loadCallback();
                    currentContext.moduleDefine(module, [], promise.empty);
                    defer.resolve();
                    return module.exports;
                } else {
                    var continueLoadingDefer = promise.defer();
                    currentContext.moduleDefine(module, dependencies, function (module) {
                        for (var i = 0, l = dependencies.length; i < l; i++) {
                            var item = dependencies[i];
                            if (typeof item == "string") {
                                module.require(item);
                            }
                        }
                        module.exports = loadCallback();
                        continueLoadingDefer.resolve(module.exports);
                        continueLoadingDefer = null;
                    });
                    defer.resolve();
                    return continueLoadingDefer.promise;
                }
            },
            error : defer.reject
        };
        Aria["eval"](content, module.url);
        // the previous Aria.eval should contain Aria.classDefinition (or equivalent) which
        // uses Aria.$oldModuleLoader and removes it from Aria
        if (Aria.$oldModuleLoader) {
            defer.reject(new Error("Module '"
                    + module.filename
                    + "' does not contain the expected Aria Templates class. Please check the classpath inside the file."));
        }
    } catch (e) {
        defer.reject(e);
    } finally {
        Aria.$oldModuleLoader = savedValue;
    }
    return defer.promise;
};