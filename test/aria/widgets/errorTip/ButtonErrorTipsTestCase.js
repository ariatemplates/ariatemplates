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
    $classpath : 'test.aria.widgets.errorTip.ButtonErrorTipsTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._errorTipsTestCaseEnv = {
            template : "test.aria.widgets.errorTip.TemplateButtonErrorTips",
            moduleCtrl : {
                classpath : 'test.aria.widgets.errorTip.ErrorTipsController'
            },
            data : null
        };
        this.setTestEnv(this._errorTipsTestCaseEnv);
    },
    $prototype : {

        runTemplateTest : function () {
            this.synEvent.click(this.getElementById('submitButton1'), {
                fn : this._checkErrorToolTipOpen,
                scope : this
            });
        },

        _checkErrorToolTipOpen : function () {
            var buttonWidget = this.getWidgetInstance('submitButton1');
            this.assertTrue(buttonWidget._cfg.error);
            this.assertTrue(!!buttonWidget._onValidatePopup);
            this.finishTest();
        },

        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
