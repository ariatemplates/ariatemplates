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
    $classpath : "test.aria.templates.section.sectionAttributes.binding.SectionAttributesBindingBase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this._recursive = this._recursive !== false;

        this.testData = {
            attributes : {
                title : "change section title",
                name : "change section name",
                classList : ["class1", "class2"],
                dataset : {
                    index : "one",
                    some : "thing"
                }
            },
            recursive : this._recursive
        };

        this.setTestEnv({
            template : "test.aria.templates.section.sectionAttributes.binding.SectionAttributesBindingBaseTpl",
            data : this.testData
        });

    },
    $destructor : function () {
        this._domWrapper = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {

            this._domWrapper = this.templateCtxt.$getElementById("sectionx");
            var jsonUtil = aria.utils.Json, recursive = this._recursive;

            // initial check
            this._checkSectionAttributes({
                title : "change section title",
                name : "change section name",
                classList : ["class1", "class2"],
                dataset : {
                    index : "one",
                    some : "thing"
                }
            });

            // change the whole attributes object
            jsonUtil.setValue(this.testData, "attributes", {
                name : "change section name",
                lang : "en",
                simon : true
            });

            var nonRecursiveChange = {
                name : "change section name",
                lang : "en",
                title : null,
                classList : [],
                dataset : {
                    index : null,
                    some : null
                }
            };

            this._checkSectionAttributes(nonRecursiveChange);

            // add an attribute
            jsonUtil.setValue(this.testData.attributes, "title", "my new title");

            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : []
            } : nonRecursiveChange);

            // add another one
            jsonUtil.setValue(this.testData.attributes, "classList", ["classOne", "classTwo", "classThree"]);

            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : ["classOne", "classTwo", "classThree"]
            } : nonRecursiveChange);

            // and another one
            jsonUtil.setValue(this.testData.attributes, "dataset", {
                id : "justOne",
                id2 : "justTwo"
            });

            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : ["classOne", "classTwo", "classThree"],
                dataset : {
                    id : "justOne",
                    id2 : "justTwo"
                }
            } : nonRecursiveChange);

            // modify an item in the classList and in the dataset
            jsonUtil.splice(this.testData.attributes.classList, 1, 1, "classFour");

            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : ["classOne", "classFour", "classThree"],
                dataset : {
                    id : "justOne",
                    id2 : "justTwo"
                }
            } : nonRecursiveChange);

            jsonUtil.setValue(this.testData.attributes.dataset, "id", "notJustOne");
            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : ["classOne", "classFour", "classThree"],
                dataset : {
                    id : "notJustOne",
                    id2 : "justTwo"
                }
            } : nonRecursiveChange);

            jsonUtil.setValue(this.testData.attributes.dataset, "id3", "justThree");
            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : ["classOne", "classFour", "classThree"],
                dataset : {
                    id : "notJustOne",
                    id2 : "justTwo",
                    id3 : "justThree"
                }
            } : nonRecursiveChange);

            jsonUtil.setValue(this.testData.attributes, "dataset", {
                id : "justOne",
                id2 : "justTwo"
            });

            this._checkSectionAttributes(recursive ? {
                name : "change section name",
                lang : "en",
                title : "my new title",
                classList : ["classOne", "classFour", "classThree"],
                dataset : {
                    id : "justOne",
                    id2 : "justTwo",
                    id3 : null
                }
            } : nonRecursiveChange);

            // then a final radical change

            jsonUtil.setValue(this.testData, "attributes", {
                height : "400"
            });

            this._checkSectionAttributes({
                height : "400",
                name : null,
                dir : null,
                title : null,
                classList : [],
                dataset : {
                    id : null,
                    id2 : null,
                    id3 : null
                }
            });

            // change the classList on the Section wrapper and see if the changes are reflected in the data model
            var changeCount = 0;
            var changeListener = {
                fn : function (change) {
                    changeCount++;
                },
                scope : this
            };
            jsonUtil.addListener(this.testData, "attributes", changeListener, false, true);

            this._domWrapper.classList.setClassName("c3 c4");
            this.assertEquals(changeCount, 1, "The data model listeners have not been called after a className change on the section wrapper");
            this.assertEquals(this.testData.attributes.classList.join(" "), "c3 c4", "The data model has not been updated after a className change on the section wrapper");

            jsonUtil.removeListener(this.testData, "attributes", changeListener, false, true);
            changeListener = null;

            this.end();
        },

        _checkSectionAttributes : function (attributes) {
            // check attributes
            var jsonUtil = aria.utils.Json;
            for (var att in attributes) {
                if (attributes.hasOwnProperty(att) && !jsonUtil.isMetadata(att)) {
                    if (att == "classList") {
                        this._checkClassList(attributes[att]);
                    } else if (att == "dataset") {
                        this._checkDataset(attributes[att]);
                    } else {
                        this._checkSimpleAttribute(att, attributes[att]);
                    }
                }
            }
        },

        _checkSimpleAttribute : function (name, value) {
            var attributeValue = this._domWrapper.getAttribute(name);
            attributeValue = attributeValue || null;
            this.assertEquals(value, attributeValue, "Attribute " + name + " has not been correctly set. Expected: "
                    + value + ", got: " + attributeValue);
        },

        _checkClassList : function (classList) {
            this.assertEquals(classList.join(" "), this._domWrapper.classList.getClassName(), "The classList attribute has not been correctly set");
        },

        _checkDataset : function (dataset) {
            var jsonUtil = aria.utils.Json;
            for (var name in dataset) {
                if (dataset.hasOwnProperty(name) && !jsonUtil.isMetadata(name)) {
                    this.assertEquals(dataset[name], this._domWrapper.getData(name), "Data " + name
                            + " has not been correctly set");
                }
            }

        }
    }
});
