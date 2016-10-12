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
    $classpath : "test.aria.widgets.form.textinput.onfocus.OnFocusTestCase",
    $extends : "test.aria.widgets.form.textinput.onclick.OnClickBase",
    $constructor : function () {
        this.$OnClickBase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.textinput.onfocus.OnFocusTemplate",
            data : {
                action : 0
            }
        });
        this._delay = 10;
    },
    $prototype : {
        simulateUserAction : function (index) {
            this.templateCtxt.$focus(this._widgetIds[index]);
            this.onAfterUserAction();
        }
    }
});
