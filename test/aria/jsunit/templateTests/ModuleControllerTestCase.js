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
    $classpath: "test.aria.jsunit.templateTests.TestCaseModuleController",
    $extends: "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.core.Browser"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : this.$package + ".MCTemplate",
            moduleCtrl : {
                classpath : this.$package + ".MCController"
            },
            data : null,
            iframe : true
        });
    },
    $prototype: {
        runTemplateTest : function () {
            // I expect the template to be loaded with a controller and a widget inside a sub-template
            this.clickAndType("writeInMe", "hello", {
                fn : this.checkType,
                scope : this
            }, true);
        },

        checkType : function () {
            if (aria.core.Browser.isPhantomJS) {
                // Incredibly enough in PhantomJS text is reversed
                this.assertEquals(this.templateCtxt.data.values.text, "olleh");
            } else {
                this.assertEquals(this.templateCtxt.data.values.text, "hello");
            }
            this.assertEquals(this.templateCtxt.moduleCtrl.countChanges(), 1, "Expecting a change event, got %1");
            this.end();
        }
    }
});
