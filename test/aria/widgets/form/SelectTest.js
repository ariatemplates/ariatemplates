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
    $classpath : "test.aria.widgets.form.SelectTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["test.aria.widgets.form.ListData"],
    $prototype : {
        /**
         * Create an instance of a select widget.
         */
        _createSelect : function (cfg) {
            var widget = new aria.widgets.form.Select(cfg, this.outObj.tplCtxt);
            widget.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            // init widget
            widget.initWidget();
            var dom = widget.getDom();
            if (aria.core.Browser.isIE7) {
                dom = dom.firstChild;
            }
            return {
                instance : widget,
                dom : dom
            };
        },

        testAsyncSimpleHTMLVersion : function () {
            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.Select"],
                oncomplete : {
                    fn : this._testSimpleHTMLVersion,
                    scope : this
                }
            });
        },

        _testSimpleHTMLVersion : function () {

            var listData = new test.aria.widgets.form.ListData();

            var data = {
                prop : "value"
            };

            var event = {
                keyCode : 13
            };

            var array = ["USA"];
            var select = this._createSelect({
                label : "SELECTLABEL",
                options : listData.data.countries,
                sclass : 'simple',
                bind : {
                    value : {
                        to : 0,
                        inside : array
                    }
                }
            });

            var instance = select.instance;

            // test initialised bound value
            this.assertTrue(instance._cfg.value === "USA");

            // test onblur
            instance._updateValue(false);
            instance._onBoundPropertyChange("value", "CH", instance._cfg.value);
            instance._dom_onblur(false);
            this.assertTrue(instance._cfg.value === "CH");

            // test onclick
            instance._onBoundPropertyChange("value", "UK", instance._cfg.value);
            instance._dom_onclick(false);
            this.assertTrue(instance._cfg.value === "UK");

            instance._onBoundPropertyChange("value", "SE", instance._cfg.value);
            instance._dom_onchange(false);
            this.assertTrue(instance._cfg.value === "SE");

            // test Enter key
            instance._onBoundPropertyChange("value", "US", instance._cfg.value);
            instance._dom_onkeypress(event);
            this.assertTrue(instance._cfg.value === "US");

            // test Escape key (escape does not change the data model)
            instance._onBoundPropertyChange("value", "ES", instance._cfg.value);
            event.keyCode = 27;
            instance._dom_onkeypress(event);
            this.assertTrue(instance._cfg.value === "US");

            // test onBoundPropertyChange
            instance._onBoundPropertyChange("value", "PL", array);
            this.assertTrue(instance._selectField[instance._selectField.selectedIndex].value === "PL");

            // test getSelectField
            var testSelect = {};
            testSelect = instance.getSelectField();
            this.assertTrue(instance._selectField.selectedIndex == testSelect.selectedIndex);

            instance.$dispose();
            listData.$dispose();

            this.notifyTestEnd("testAsyncSimpleHTMLVersion");
        }
    }
});