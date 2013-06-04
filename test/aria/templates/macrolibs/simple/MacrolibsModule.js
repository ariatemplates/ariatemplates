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

/**
 * Module Controller part of the test case for Autorefresh
 * @class test.templateTests.tests.autorefresh.MacrolibsModule
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.macrolibs.simple.MacrolibsModule",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.templates.macrolibs.simple.IMacrolibsModule"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._data = {
            hey : "ciao"
        };
    },
    $destructor : function () {
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : 'test.aria.templates.macrolibs.simple.IMacrolibsModule',

        dog : function () {
            return this._data.hey + ", dog";
        }
    }
});