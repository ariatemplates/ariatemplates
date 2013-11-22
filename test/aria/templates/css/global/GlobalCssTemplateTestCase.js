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
 * @class test.aria.templates.css.global.GlobalCssTemplateTestCase",
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.css.global.GlobalCssTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.css.global.TemplateStepWithoutPrefix"
        });
        // this.defaultTestTimeout = 4000;
    },

    $prototype : {
        tearDown : function () {
            aria.core.IO.$unregisterListeners(this);
        },
        runTemplateTest : function () {

            var textLoaded = aria.templates.CSSMgr.__textLoaded["test.aria.templates.css.global.CSSWithoutPrefix"];
            this.assertTrue(textLoaded.text.indexOf("CSS") < 0, "Failed to prefix css class.");

            this._replaceTestTemplate({
                template : "test.aria.templates.css.global.TemplateStepWithPrefix"
            }, {
                fn : this._testWithoutPrefix,
                scope : this
            });

        },
        _testWithoutPrefix : function () {
            var textLoaded = aria.templates.CSSMgr.__textLoaded["test.aria.templates.css.global.CSSWithPrefix"];
            this.assertTrue(textLoaded.text.indexOf("CSS") > 0, "Failed to unprefix css class.");

            this.notifyTemplateTestEnd();
        }
    }
});
