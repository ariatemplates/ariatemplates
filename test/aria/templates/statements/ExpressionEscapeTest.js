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
    $classpath: "test.aria.templates.statements.ExpressionEscapeTest",
    $extends: "aria.jsunit.TemplateTestCase",
    $dependencies: ["aria.utils.Dom", "aria.utils.String"],

    $statics: {
        /***********************************************************************
         * Use cases
         **********************************************************************/

        USE_CASES: {
            // The following use cases test the standard application of the escaping both with a default application
            // and an explicit use of the modifier
            'default': {
                outputText: "<div class='output' style=\"color:blue\">&amp;</div>"
            },

            'implicit': {
                outputText: "<div class='output' style=\"color:blue\">&amp;</div>"
            },

            'all-boolean': {
                outputText: "<div class='output' style=\"color:blue\">&amp;</div>"
            },
            'all-object': {
                outputText: "<div class='output' style=\"color:blue\">&amp;</div>"
            },

            'nothing-boolean': {
                outputText: "&",
                outputNodesNumber: 1

            },
            'nothing-object': {
                outputText: "&",
                outputNodesNumber: 1
            },

            'attr': {
                outputText: "&",
                outputNodesNumber: 1
            },
            'text': {
                outputText: "<div class='output' style=\"color:blue\">&amp;</div>"
            },

            'special-attr': {
                outputText: "",
                outputNodesNumber: 1,
                attributes: {
                    'data-quot': '"quot"',
                    'data-apos': "'apos'"
                }
            },

            // The following use cases just test the behavior of the escaping with the specific unsafe modifiers
            // (default and empty), both with a default application and an explicit use of the escaping modifier
            'default-modifier-default': {
                outputText: "<div></div>"
            },
            'nothing-modifier-default-before': {
                outputText: "",
                outputNodesNumber: 1
            },
            'nothing-modifier-default-after': {
                outputText: "",
                outputNodesNumber: 1
            },
            'all-modifier-default-before': {
                outputText: "",
                outputNodesNumber: 1
            },
            'all-modifier-default-after': {
                outputText: "<div></div>"
            },

            'default-modifier-empty': {
                outputText: "<div></div>"
            },
            'nothing-modifier-empty-before': {
                outputText: "",
                outputNodesNumber: 1
            },
            'nothing-modifier-empty-after': {
                outputText: "",
                outputNodesNumber: 1
            },
            'all-modifier-empty-before': {
                outputText: "",
                outputNodesNumber: 1
            },
            'all-modifier-empty-after': {
                outputText: "<div></div>"
            }
        }
    },

    $prototype: {
        /***********************************************************************
         * Tests
         **********************************************************************/

        runTemplateTest: function() {
            this.__forOwn(this.USE_CASES, this.__testUseCase);

            this.end();
        },

        __testUseCase: function(domId, useCase) {
            // Expected results ------------------------------------------------

            // ----------------------------------------------------- output text

            var expectedText = useCase.outputText;
            if (expectedText == null) {
                expectedText = "";
            }

            // ------------------------------------------------- number of nodes

            var expectedNumberOfNodes = useCase.outputNodesNumber;
            if (expectedNumberOfNodes == null) {
                expectedNumberOfNodes = 0;
            }

            // ------------------------------------------------------ attributes

            var attributes = useCase.attributes;



            // Results extraction ----------------------------------------------

            var element = this.getElementById(domId);

            // ---------------------------------------- text content of the node

            var textContent = element.textContent || element.innerText || element.nodeValue || "";
            textContent = textContent.replace(/\n/g, '');
            textContent = textContent.replace(/^\s+|\s+$/g, '');

            // --------------- number of children nodes which are not text nodes

            var numberOfChildren = 0;
            var children = element.childNodes;

            this.__forEach(children, function(index, child) {
                if (child.nodeType === 1) {
                    numberOfChildren++;
                }
            });



            // Assertions ------------------------------------------------------

            // ---------------------------------------------------- text content

            this.assertEquals(
                textContent,
                expectedText,

                this.__formatErrorMessage("Wrong text content.", [
                    {
                        label: "id",
                        value: domId
                    },
                    {
                        label: "text content",
                        value: aria.utils.String.escapeForHTML(textContent, {text: true})
                    },
                    {
                        label: "expected text",
                        value: aria.utils.String.escapeForHTML(expectedText, {text: true})
                    }
                ])
            );

            // ------------------------------------------------- number of nodes

            this.assertEquals(
                numberOfChildren,
                expectedNumberOfNodes,

                this.__formatErrorMessage("Wrong number of children nodes.", [
                    {
                        label: "id",
                        value: domId
                    },
                    {
                        label: "number of children",
                        value: numberOfChildren
                    },
                    {
                        label: "expected number of children",
                        value: expectedNumberOfNodes
                    }
                ])
            );

            // --------------------------------------- attributes (if specified)

            if (attributes != null) {
                var child = element.getElementsByTagName("div")[0];

                this.__forOwn(attributes, function(attrName, expectedAttrValue) {
                    var attrValue = child.getAttribute(attrName);

                    this.assertEquals(
                        attrValue,
                        expectedAttrValue,

                        this.__formatErrorMessage("Wrong attributes.", [
                            {
                                label: "id",
                                value: domId
                            },
                            {
                                label: "attribute name",
                                value: attrName
                            },
                            {
                                label: "attribute value",
                                value: attrValue
                            },
                            {
                                label: "expected attribute value",
                                value: expectedAttrValue
                            }
                        ])
                    );
                });
            }
        },



        /***********************************************************************
         * Test helpers
         **********************************************************************/

        __formatErrorMessage : function(message, properties) {
            var outputParts = [];

            outputParts.push(message);

            this.__forEach(properties, function(index, property) {
                var label = property.label;
                var value = property.value;

                outputParts.push(label + ": " + value);
            });

            return outputParts.join(" | ");
        },



        /***********************************************************************
         * Helpers
         **********************************************************************/

        __forOwn: function(collection, callback, thisArg) {
            if (thisArg == null) {
                thisArg = this;
            }

            for (var key in collection) {
                if (collection.hasOwnProperty(key)) {
                    var item = collection[key];

                    callback.call(thisArg, key, item, collection);
                }
            }
        },

        __forEach : function(collection, callback, thisArg) {
            if (thisArg == null) {
                thisArg = this;
            }

            for (var index = 0, length = collection.length; index < length; index++) {
                var item = collection[index];

                callback.call(thisArg, index, item, collection);
            }
        }
    }
});
