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

Aria.classDefinition({
    $classpath : 'test.aria.modules.urlService.ModuleCtrlSample',
    $extends : "aria.templates.ModuleCtrl",
    $dependencies : ['test.aria.modules.test.MockRequestHandler', 'test.aria.modules.urlService.ModuleURLCreationImpl'],
    $constructor : function () {
        var moduleUrlPattern = Aria.rootFolderPath + "test/aria/modules/urlService/${actionName}.xml";
        this.$ModuleCtrl.constructor.call(this);
        this.$requestHandler = new test.aria.modules.test.MockRequestHandler();
        this.$urlService = new test.aria.modules.urlService.ModuleURLCreationImpl(moduleUrlPattern, null);
    },
    $destructor : function () {
        this.$requestHandler.$dispose();
        this.$urlService.$dispose();
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {}
});
