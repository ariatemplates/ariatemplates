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

/**
 * Test case for aria.widgets.form.Input
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Html",
    $dependencies : ["aria.utils.Html", "aria.templates.DomElementWrapper", "aria.utils.String"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        // Check string against json
        checkString : function (str, attributes) {
            var stringUtil = aria.utils.String;
            var document = Aria.$frameworkWindow.document;
            var el = document.createElement("div");
            var html = "<div " + str + "></div>";
            el.innerHTML = html;
            var div = el.getElementsByTagName("div")[0];
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    var attribute = attributes[key];
                    if (key === "classList") {

                        var classesStr = div.className;
                        for (var i = 0, ii = attribute.length; i < ii; i++) {
                            this.assertTrue(classesStr.indexOf(attribute[i]) > -1, "The class " + attribute[i]
                                    + " should be in the generated markup");
                        }
                    } else if (key === "dataset") {
                        for (var dataKey in attribute) {
                            if (attribute.hasOwnProperty(dataKey)) {
                                var value = stringUtil.encodeForQuotedHTMLAttribute(attribute[dataKey]);
                                // in "dataset" the key will be camelCased, but as an HTML attrib
                                // it gets converted to dash-separated equivalent
                                var queryKey = stringUtil.camelToDashed(dataKey);
                                var got = div.getAttribute("data-" + queryKey);
                                this.assertEquals(got, value, "data-" + dataKey + " should be %2, got %1");
                            }
                        }
                    } else if (aria.templates.DomElementWrapper.attributesWhiteList.test(key)) {
                        var value = stringUtil.encodeForQuotedHTMLAttribute(attribute);
                        var got = div.getAttribute(key);

                        if (key === "style") {
                            if (!aria.utils.Type.isString(got)) {
                                got = got.cssText;
                            }
                            // IE messes up pretty badly with style tags
                            got = got.toLowerCase();
                            // just add a semicolon if missing
                            if (got.charAt(got.length - 1) !== ";") {
                                got += ";";
                            }
                        }

                        if (aria.core.Browser.isIE7 && (key == "disabled" || key == "nowrap")) {
                            value = true;
                        }

                        this.assertEquals(got, value, "The attribute " + key + " should be " + value + " got " + got);
                    }
                }
            }

        },

        /**
         * Test case on the aria.utils.Html.buildAttributeList method
         */
        test_buildAttributeList : function () {
            var html = aria.utils.Html;

            var json = {
                abbr : "abbr",
                align : "align",
                alt : "alt",
                border : "1px solid black",
                cellpadding : "0px",
                cellspacing : "0px",
                checked : "true",
                classList : ["class1", "class2", "class3"],
                cols : "2",
                colspan : "2",
                dataset : { /* in the dataset, keys are camelCased, and do not have "data-" prefix */
                    data1 : "data1-value",
                    data2 : "data2-value",
                    "foo" : "data-foo-value",
                    "fooBar" : "data-foo-bar-value",
                    data3 : "data3-value"
                },
                dir : "ltr",
                disabled : "disabled",
                height : "100px",
                lang : "en-US",
                maxlength : "10",
                multiple : "true",
                name : "elementName",
                nowrap : "nowrap",
                readonly : "false",
                rows : "10",
                rowspan : "2",
                selected : "myValue",
                size : "100px",
                style : "color: black;",
                title : "myElement",
                type : "text",
                valign : "middle",
                value : "my value",
                width : "100px",
                "aria-label" : "label",
                "data-testExpando" : "testExpando",
                "data-attrib-with-dashes" : "test", /* on the "root" attributes level, keys are "data-"-prefixed and dashed */
                autocomplete : "off",
                autofocus : "autofocus",
                autocorrect : "on",
                autocapitalize : "off",
                spellcheck : "true"

            };

            var str = html.buildAttributeList(json);
            this.checkString(str, json);
        },

        testBuildAttributeListDataSetInvalid : function () {
            var html = aria.utils.Html;

            // in dataset, keys are camelCased: https://developer.mozilla.org/en-US/docs/DOM/element.dataset
            // (however they're converted into hyphenated keys when injected into HTML)
            var str = this._testDatasetKey("foo-bar");
            this.assertErrorInLogs(html.INVALID_DATASET_KEY);

            var str = this._testDatasetKey("weird$characters^");
            this.assertErrorInLogs(html.INVALID_DATASET_KEY);
        },

        _testDatasetKey : function (key) {
            var json = {
                dataset : {}
            };
            json.dataset[key] = "test";
            return aria.utils.Html.buildAttributeList(json);
        },

        test_serializeForm : function () {

            var document = Aria.$window.document, testDiv = document.createElement("div"), html = aria.utils.Html;
            document.body.appendChild(testDiv);
            testDiv.innerHTML = '<form id="testForm"></form>';
            var testFormElement = document.getElementById("testForm");

            // simple scenario
            testFormElement.innerHTML = '<input type="text" name="firstname" value="Colin"/><input type="date" name="birth" value="2012-04-04"/>';
            this.assertEquals(html.serializeForm(testFormElement), "firstname=Colin&birth=2012-04-04");

            // disabled element
            testFormElement.innerHTML = '<input type="text" name="firstname" value="Colin"/><input type="date" name="birth" value="2012-04-04" disabled/>';
            this.assertEquals(html.serializeForm(testFormElement), "firstname=Colin");

            // element without name attribute
            testFormElement.innerHTML = '<input type="text" name="firstname" value="Colin"/><input type="date" value="2012-04-04" />';
            this.assertEquals(html.serializeForm(testFormElement), "firstname=Colin");

            // element without value
            testFormElement.innerHTML = '<input type="text" name="firstname"/><input type="date" value="2012-04-04" />';
            this.assertEquals(html.serializeForm(testFormElement), "firstname=");

            // element with characters to encode
            testFormElement.innerHTML = '<input type="text" name="first name" value="Co&in"/><input type="date" value="2012-04-04" />';
            this.assertEquals(html.serializeForm(testFormElement), "first+name=Co%26in");

            // submittable element
            testFormElement.innerHTML = '<input type="text" name="first name" value="Co&in"/><input type="file" name="picture" />';
            this.assertEquals(html.serializeForm(testFormElement), "first+name=Co%26in");

            // select and textarea
            testFormElement.innerHTML = '<select type="text" name="class" value="A"><option value="A">A</option><option value="B">B</option></select><textarea name="comment">whatever you want</textarea>';
            this.assertEquals(html.serializeForm(testFormElement), "class=A&comment=whatever+you+want");

            // checkbox
            testFormElement.innerHTML = '<input type="checkbox" name="vehicle" value="Bike" checked /><input type="checkbox" name="other" value="Car" />';
            this.assertEquals(html.serializeForm(testFormElement), "vehicle=Bike");

            document.body.removeChild(testDiv);
        },

        test_setOrRemoveDataset : function () {

            var document = Aria.$window.document, testDiv = document.createElement("div"), html = aria.utils.Html;
            document.body.appendChild(testDiv);
            var should, shouldNot;

            // check the set method

            html.setDataset(testDiv, {
                "index" : "one",
                "quoted" : "\"quoted",
                "camCase" : "more"
            });

            should = {
                "index" : "one",
                "quoted" : "\"quoted",
                "cam-case" : "more"
            };

            shouldNot = ["camcase"];

            this.checkDataset(testDiv, should, shouldNot);

            // check the remove method

            html.removeDataset(testDiv, {
                "index" : "one",
                "camCase" : "more"
            });
            should = {
                "quoted" : "\"quoted"
            };
            shouldNot = ["camcase", "index", "cam-case"];

            this.checkDataset(testDiv, should, shouldNot);

            // check set with invalid key

            html.setDataset(testDiv, {
                "some-thing" : "two"
            });

            should = {
                "quoted" : "\"quoted"
            };

            shouldNot = ["some-thing"];

            this.checkDataset(testDiv, should, shouldNot);
            this.assertErrorInLogs(html.INVALID_DATASET_KEY, 1);

            // check set with invalid key

            html.removeDataset(testDiv, {
                "some-thing" : "two"
            });

            should = {
                "quoted" : "\"quoted"
            };

            shouldNot = ["some-thing"];

            this.checkDataset(testDiv, should, shouldNot);
            this.assertErrorInLogs(html.INVALID_DATASET_KEY, 1);

            document.body.removeChild(testDiv);
        },

        checkDataset : function (element, should, shouldNot) {
            var fullKey;
            for (var att in should) {
                fullKey = "data-" + att;
                this.assertEquals(element.getAttribute(fullKey), should[att]);
            }
            for (var i = 0, len = shouldNot.length; i < len; i++) {
                fullKey = "data-" + shouldNot[i];
                this.assertNull(element.getAttribute(fullKey));
            }
        }

    }
});
