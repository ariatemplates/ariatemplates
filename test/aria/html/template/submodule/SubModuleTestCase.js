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

Aria.classDefinition({
    $classpath : "test.aria.html.template.submodule.SubModuleTestCase",
    $extends : "aria.jsunit.TemplateTestCase",

    $constructor : function () {

        this.testData = {};
        this.secondTestData = {};

        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : 'test.aria.html.template.submodule.MainTemplate',
            moduleCtrl : {
                classpath : "test.aria.html.template.submodule.Module",
                initArgs : this.testData
            },
            data : null
        });
        this.defaultTestTimeout = 20000;
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {
            this.assertTrue(this.testData.callCheck);
            this.assertTrue(this.testData.value == "Sub module", "The data model of the sub-template has not been correctly initialized");
            this._replaceTestTemplate({
                template : 'test.aria.html.template.submodule.SecondMainTemplate',
                data : this.secondTestData
            }, {
                fn : this._runSecondTest,
                scope : this
            });
        },

        _runSecondTest : function () {
            this.assertTrue(this.secondTestData.testSuccess);
            this.end();
        }
    }
});