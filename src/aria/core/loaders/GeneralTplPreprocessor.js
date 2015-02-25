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

var asyncRequire = require("noder-js/asyncRequire").create(module);
var firstComment = /^\s*\/\*[\s\S]*?\*\//;
var alreadyGeneratedRegExp = /^\s*(?:var\s+|Aria\.classDefinition\()/;

var getExtension = function (filename) {
    var withoutPath = filename.replace(/^(.*\/)?([^/]*)$/, "$2");
    var dot = withoutPath.indexOf('.');
    if (dot > -1) {
        return withoutPath.substr(dot);
    }
    return "";
};

var isTemplateCompiled = function (fileContent) {
    fileContent = fileContent.replace(firstComment, ''); // removes first comment
    return alreadyGeneratedRegExp.test(fileContent);
};

var preprocessors = {
    ".tpl" : "./TplPreprocessor",
    ".tpl.css" : "./CSSPreprocessor",
    ".tpl.txt" : "./TxtPreprocessor",
    ".cml" : "./CmlPreprocessor",
    ".tml" : "./TmlPreprocessor"
};

module.exports = function (content, moduleFileName) {
    var ext = getExtension(moduleFileName);
    var curPreprocessorPath = preprocessors[ext];
    if (!curPreprocessorPath || isTemplateCompiled(content)) {
        return content;
    }
    return asyncRequire(curPreprocessorPath).spreadSync(function (curPreprocessor) {
        return curPreprocessor(content, moduleFileName);
    });
};
