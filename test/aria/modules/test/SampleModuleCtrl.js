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
    $classpath : "test.aria.modules.test.SampleModuleCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $dependencies : ["aria.modules.requestHandler.JSONRequestHandler", "aria.modules.urlService.PatternURLCreationImpl"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this.$requestHandler = new aria.modules.requestHandler.JSONRequestHandler();
        this.$urlService = new aria.modules.urlService.PatternURLCreationImpl("/test?moduleName=${moduleName}&actionName=${actionName}&sessionId=${sessionId}", "should not be used");
    },
    $destructor : function () {
        if (this.$requestHandler) {
            this.$requestHandler.$dispose();
            this.$requestHandler = null;
        }
        if (this.$urlService) {
            this.$urlService.$dispose();
            this.$urlService = null;
        }
    }
});
