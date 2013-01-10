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
                                    + " shoud be in the generated markup");
                        }
                    } else if (key === "dataset") {
                        for (var dataKey in attribute) {
                            if (attribute.hasOwnProperty(dataKey) && dataKey.substr(0, 5) != "data-") {
                                var value = stringUtil.encodeForQuotedHTMLAttribute(attribute[dataKey]);
                                var got = div.getAttribute("data-" + dataKey);
                                this.assertEquals(got, value, "The data data-" + dataKey + " should be equals to "
                                        + value);
                            }
                        }
                    } else if (aria.templates.DomElementWrapper.attributesWhiteList.test(key)) {
                        var value = stringUtil.encodeForQuotedHTMLAttribute(attribute);
                        var got = div.getAttribute(key);

                        if (key === "style") {
                            // IE messes up pretty badly with style tags
                            got = got.toLowerCase();
                            // just add a semicolon if missing
                            if (got.charAt(got.length - 1) !== ";") {
                                got += ";"
                            }
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
                dataset : {
                    data1 : "data1-value",
                    data2 : "data2-value",
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
                width : "100px"

            };

            var str = html.buildAttributeList(json);

            this.checkString(str, json);
        }
    }
});