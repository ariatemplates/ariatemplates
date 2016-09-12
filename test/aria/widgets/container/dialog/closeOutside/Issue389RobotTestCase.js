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
    $classpath : "test.aria.widgets.container.dialog.closeOutside.Issue389TestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
            dialogTitle : "title",
            visible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.closeOutside.Main",
            data : this.data
        });

    },
    $prototype : {
        runTemplateTest : function () {
            var textField1 = this.getInputField("textField1");

            this.synEvent.execute([["click", textField1], ["type", textField1, "Test1"]], {
                fn : this.__afterFirstType,
                scope : this
            });

        },

        __afterFirstType : function () {
            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.__afterFirstClick,
                scope : this
            });
        },

        __afterFirstClick : function () {
            var inDataModel = this.templateCtxt._tpl.data.dialogTitle;
            this.assertEquals(inDataModel, "titleTest1", "Incorrect value in datamodel, got '%1' expecting '%2'");

            aria.utils.Json.setValue(this.data, "visible", true);
            var textField1 = this.getInputField("textField1");
            this.assertEquals(textField1.value, "titleTest1", "Incorrect value in textfield, got '%1' expecting '%2'");

            this.end();
        }
    }
});
