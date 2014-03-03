/*
 * Copyright 2014 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.tools.debug.testFiles.RedirectToBrokenFilter",
    $extends : "aria.core.IOFilter",
    $dependencies : ["aria.utils.String"],
    $prototype : {
        onRequest : function (req) {
            if (aria.utils.String.endsWith(req.url, "FooClass.js")) {
                this.redirectToFile(req, "test/aria/tools/debug/testFiles/FooClassBroken.js");
            }
            if (aria.utils.String.endsWith(req.url, "BarClass.js")) {
                this.redirectToFile(req, "test/aria/tools/debug/testFiles/BarClassTweaked.js");
            }
        }
    }
});
