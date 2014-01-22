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
    $classpath : "test.aria.widgets.form.list.ListTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.listContainer = null;
        this.children = null;
        this.data = {
            italian : [{ value: "D", label: "Donizetti"}, { value: "B", label: "Bellini" }, { value: "V", label: "Verdi" }]
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.list.ListTestCaseTpl",
            data : this.data
        });
    },
    $destructor : function () {
        this.listContainer = null;
        this.children = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.listContainer = this.getWidgetDomElement("myId", "div");
            this.children = this.getElementsByClassName(this.listContainer, "xListEnabledItem_std");

            this.assertTrue(this.children.length === 3, "The number of list items is not 3");

            if (aria.core.Browser.isIE && aria.core.Browser.majorVersion < 9) {
                aria.core.Timer.addCallback({
                    fn: this.waitForIE,
                    scope: this,
                    delay: 500
                });
            } else {
                this.addItem();
                this.assertTrue(this.children.length === 4, "The item was not added to the DOM");

                this.removeItem();
                this.assertTrue(this.children.length === 3, "The item was not removed from the DOM");

                this.notifyTemplateTestEnd();
            }
        },

        waitForIE : function () {
            this.addItem();
            this.listContainer = this.getWidgetDomElement("myId", "div");
            this.children = this.getElementsByClassName(this.listContainer, "xListEnabledItem_std");
            this.assertTrue(this.children.length === 4, "The item was not added to the DOM");

            this.removeItem();
            this.listContainer = this.getWidgetDomElement("myId", "div");
            this.children = this.getElementsByClassName(this.listContainer, "xListEnabledItem_std");
            this.assertTrue(this.children.length === 3, "The item was not removed from the DOM");

            this.notifyTemplateTestEnd();
        },

        addItem : function () {
            aria.utils.Json.add(this.data.italian, { value: "p", label: "Puccini"});
        },

        removeItem : function () {
            aria.utils.Json.removeAt(this.data.italian, 3);
        }
    }
});
