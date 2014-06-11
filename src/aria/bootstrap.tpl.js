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
/* jshint -W117 : true, -W098 : true */
var request = require("noder-js/request");
var currentContext = require("noder-js/currentContext");
var modulesToExecute = [];
var syncRequire = function (logicalPath) {
    var url = Aria.rootFolderPath + logicalPath;
    request(url, {
        sync : true
    }).thenSync(function (xhr) {
        var newModule = currentContext.jsModuleDefine(xhr.responseText, logicalPath, url);
        modulesToExecute.push(newModule);
    }).done();
};

// The following content is replaced at build time by a set of calls to syncRequire
// for each file to be included in the bootstrap
$CONTENT$;

// Once everything is in the cache, let's execute all modules:
for (var i = 0, l = modulesToExecute.length; i < l ; i++) {
    currentContext.moduleExecuteSync(modulesToExecute[i]);
}
modulesToExecute = null;
