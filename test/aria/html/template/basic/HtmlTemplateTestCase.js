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
    $classpath : "test.aria.html.template.basic.HtmlTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",

    $constructor : function () {

        this.$TemplateTestCase.constructor.call(this);
        var data = {};
        data["inheritedData"] = "Data loaded from module controller successfully!!!";
        data["childTemplateData"] = {
            specificData : "Data specific to child template"
        };
        this.setTestEnv({
            template : "test.aria.html.template.basic.SimpleTemplate",
            data : data,
            moduleCtrl : {
                classpath : "test.aria.html.template.basic.SimpleTemplateController"
            }
        });
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {

        _getSubTplWidget : function () {
            var document = Aria.$window.document;
            var tplWidget = this.getWidgetInstance("viewMainTpl");
            this.assertTrue(tplWidget._subTplDiv.nodeName == "SPAN", "The tag name must be SPAN, instead of: "
                    + tplWidget._subTplDiv.nodeName);

            this.assertTrue(document.getElementById("subTemplateItem").className == "elemContent", "Failed loading the subtemplate content!");

            // Tests the passed data from parent template
            this.assertTrue(document.getElementById("childSubTemplate").innerHTML == "Data specific to child template", "Failed loading data in child subtemplate!");

            this.assertTrue(tplWidget.subTplCtxt.moduleCtrl == this.templateCtxt.moduleCtrl, "Invalid moduleCtrl");
            return tplWidget;
        },
        runTemplateTest : function () {

            aria.core.Timer.addCallback({
                fn : this.__afterEnvSetup,
                scope : this,
                delay : 1000
            });

        },
        __afterEnvSetup : function () {
            var tplWidget = this._getSubTplWidget();
            var moduleCtrlPrivate = tplWidget.subTplCtxt.moduleCtrlPrivate;
            var moduleCtrlPublic = tplWidget.subTplCtxt.moduleCtrl;
            this.assertTrue(moduleCtrlPublic == moduleCtrlPrivate.$publicInterface());
            this.notifyTemplateTestEnd();
        }

    }
});