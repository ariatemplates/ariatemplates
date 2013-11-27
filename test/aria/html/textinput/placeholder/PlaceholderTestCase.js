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
    $classpath : "test.aria.html.textinput.placeholder.PlaceholderTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.ClassList", "aria.html.TextInput", "aria.utils.SynEvents"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.element = null;
        this.secondElement = null;
        this.thirdElement = null;
        this.cssClass = null;
        this.cssClass2 = null;
        this.cssClass3 = null;
        this._placeholderSupported = null;
        this._placeholderSupported = ("placeholder" in Aria.$window.document.createElement("input"));
        this.data = {
            location : '',
            departure : '',
            arrival : 'whatever',
            click : 0,
            clickNoAutoselect : 0
        };

        this.setTestEnv({
            template : "test.aria.html.textinput.placeholder.PlaceholderTestCaseTpl",
            data : this.data
        });
    },
    $destructor : function () {
        this.element = null;
        this.secondElement = null;
        this.thirdElement = null;
        this.cssClass.$dispose();
        this.cssClass2.$dispose();
        this.cssClass3.$dispose();
        this._placeholderSupported = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var document = Aria.$window.document;
            var inputs = document.getElementsByTagName("input");
            this.element = inputs[0];
            this.secondElement = inputs[1];
            this.thirdElement = inputs[2];
            this.cssClass = new aria.utils.ClassList(this.element);
            this.cssClass2 = new aria.utils.ClassList(this.secondElement);
            this.cssClass3 = new aria.utils.ClassList(this.thirdElement);

            // Check that in IE6/7/8/9 and FF 3.6 there is the css class 'placeholder' and the value inside the text
            // input and for the other browser check the attributes placeholder

            if (!this._placeholderSupported) {
                this.assertEquals(this.element.value, "Support placeholder", "The value inside the text input is not the placeholder");
                this.assertTrue(this.cssClass.contains("placeholder"), "Css class placeholder is missing");
                aria.utils.SynEvents.click(this.element, {
                    fn : this.afterFirstClick,
                    scope : this
                });
            } else {
                this.assertEquals(this.element.placeholder, "Support placeholder", "The placeholder is not the placeholder expected");
                this.assertEquals(this.secondElement.placeholder, "Support placeholder", "The placeholder is not the placeholder expected");
                this.end();
            }
        },

        afterFirstClick : function () {
            this.assertEquals(this.element.value, "Support placeholder", "The placeholder is not displayed");
            this.assertTrue(this.cssClass.contains("placeholder"), "Css class placeholder is missing");

            aria.utils.SynEvents.type(this.element, "japan", {
                fn : this.afterType,
                scope : this
            });
        },

        afterType : function () {
            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.assertEquals(this.element.value, "japan", "The placeholder is displayed");
            this.assertTrue(!this.cssClass.contains("placeholder"), "Css class placeholder is there");

            aria.utils.SynEvents.click(outside, {
                fn : this.afterClickOutside,
                scope : this
            });
        },

        afterClickOutside : function () {
            this.assertEquals(this.element.value, "japan", "The placeholder is displayed");
            this.assertTrue(!this.cssClass.contains("placeholder"), "Css class placeholder is there");

            aria.utils.SynEvents.click(this.element, {
                fn : this.afterSecondClick,
                scope : this
            });
        },

        afterSecondClick : function () {
            this.assertEquals(this.element.value, "japan", "The placeholder is displayed");
            this.assertTrue(!this.cssClass.contains("placeholder"), "Css class placeholder is there");

            aria.utils.SynEvents.type(this.element, "\b\b\b\b\b", {
                fn : this.afterSecondType,
                scope : this
            });
        },

        afterSecondType : function () {
            this.assertEquals(this.element.value, "Support placeholder", "The placeholder is not displayed");
            this.assertTrue(this.cssClass.contains("placeholder"), "Css class placeholder is not there");

            var outside = aria.utils.Dom.getElementById("outsideDiv");

            aria.utils.SynEvents.click(outside, {
                fn : this.afterSecondClickOutside,
                scope : this
            });
        },

        afterSecondClickOutside : function () {
            this.assertEquals(this.element.value, "Support placeholder", "The placeholder is not displayed");
            this.assertTrue(this.cssClass.contains("placeholder"), "Css class placeholder is not there");
            this.assertEquals(this.templateCtxt._tpl.data.location, "", "The value inside the data model is not empty");

            // Test for the first inputtext finished!

            aria.utils.SynEvents.click(this.secondElement, {
                fn : this.afterFirstClickTwo,
                scope : this
            });
        },

        afterFirstClickTwo : function () {
            this.assertEquals(this.secondElement.value, "Support placeholder", "The placeholder is not displayed");
            this.assertTrue(this.cssClass2.contains("placeholder"), "Css class placeholder is missing");

            aria.utils.SynEvents.type(this.secondElement, "brazil", {
                fn : this.afterTypeTwo,
                scope : this
            });
        },

        afterTypeTwo : function () {
            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.assertEquals(this.secondElement.value, "brazil", "The placeholder is displayed");
            this.assertTrue(!this.cssClass2.contains("placeholder"), "Css class placeholder is there");

            aria.utils.SynEvents.click(outside, {
                fn : this.afterClickOutsideTwo,
                scope : this
            });
        },

        afterClickOutsideTwo : function () {
            this.assertEquals(this.secondElement.value, "brazil", "The placeholder is displayed");
            this.assertTrue(!this.cssClass2.contains("placeholder"), "Css class placeholder is there");

            aria.utils.SynEvents.click(this.secondElement, {
                fn : this.afterSecondClickTwo,
                scope : this
            });
        },

        afterSecondClickTwo : function () {
            this.assertEquals(this.secondElement.value, "brazil", "The placeholder is displayed");
            this.assertTrue(!this.cssClass2.contains("placeholder"), "Css class placeholder is there");

            aria.utils.SynEvents.type(this.secondElement, "\b\b\b\b\b\b", {
                fn : function() {
                    this.waitFor({
                        condition : function () {
                            return this.secondElement.value == "Support placeholder";
                        },
                        callback : function () {
                            return this.afterSecondTypeTwo();
                        }
                    });
                },
                scope : this
            });
        },

        afterSecondTypeTwo : function () {
            this.assertEquals(this.secondElement.value, "Support placeholder", "The placeholder is not displayed");
            this.assertTrue(this.cssClass2.contains("placeholder"), "Css class placeholder is not there");

            var outside = aria.utils.Dom.getElementById("outsideDiv");

            aria.utils.SynEvents.click(outside, {
                fn : this.afterSecondClickOutsideTwo,
                scope : this
            });
        },

        afterSecondClickOutsideTwo : function () {
            this.assertEquals(this.secondElement.value, "Support placeholder", "The placeholder is not displayed");
            this.assertTrue(this.cssClass2.contains("placeholder"), "Css class placeholder is not there");
            this.assertEquals(this.templateCtxt._tpl.data.departure, "", "The value inside the data model is not empty");

            this._testWhenDataChangeToNull();

        },

        _testWhenDataChangeToNull : function () {
            aria.utils.Json.setValue(this.data, "arrival", null);
            this.assertEquals(this.thirdElement.value, "Set arrival", "The placeholder is not displayed after nullifying the datamodel to which the widget is bound");
            this.assertTrue(this.cssClass3.contains("placeholder"), "Css class placeholder is not there");

            aria.utils.Json.setValue(this.data, "arrival", "fake");
            this.assertEquals(this.thirdElement.value, "fake", "The placeholder has not been removed");
            this.assertFalse(this.cssClass3.contains("placeholder"), "Css class placeholder is not removed properly after bound data changes");

            this.end();

        }

    }
});
