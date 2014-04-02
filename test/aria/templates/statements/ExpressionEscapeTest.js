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
    $dependencies: ["aria.utils.Dom", "aria.utils.String", "aria.utils.Date", "aria.utils.Type"],

    $constructor : function() {
        this.$TemplateTestCase.constructor.call(this);

        // ---------------------------------------------------------------------

        this.date = new Date();
        this.dateformat = "dd MMMM yyyy";

        var formattedDate = aria.utils.Date.format(this.date, this.dateformat);

        // Please refer to the associated template to understand the following
        // The keys of the object correspond to the ids of the "div"s encapsulating each tested use case
        // By looking at the template, you will know what the use case is about (the id gives a hint about it too). You will also see what is the input and when the escaping is expected to be done.
        // Below, you will see for each of these cases what is the expected content in the resulting HTML Text Node (inside the div), as well as the number of possibly other generated HTML nodes.

        var useCasesSpecs = {
            'automatic': "<div class='output' style=\"color:blue\">&amp;</div>",

            // -----------------------------------------------------------------

            'all-implicit': "<div class='output' style=\"color:blue\">&amp;</div>",

            'all-boolean': {
                input: "<div class='output' style=\"color:blue\">&amp;</div>",
                escape: true
            },

            'all-object': {
                input: "<div class='output' style=\"color:blue\">&amp;</div>",
                escape: {text: true, attr: true}
            },

            // -----------------------------------------------------------------

            'nothing-boolean': {
                input: "<div class='output' style=\"color:blue\">&amp;</div>",
                escape: false,
                outputText: "&",
                outputNodesNumber: 1

            },
            'nothing-object': {
                input: "<div class='output' style=\"color:blue\">&amp;</div>",
                escape: {text: false, attr: false},
                outputText: "&",
                outputNodesNumber: 1
            },

            // -----------------------------------------------------------------

            'attr': {
                input: "<div class='output' style=\"color:blue\">&amp;</div>",
                escape: {attr: true},
                outputText: "&",
                outputNodesNumber: 1
            },
            'text': "<div class='output' style=\"color:blue\">&amp;</div>",

            'attr-special': {
                escape: {attr:true},
                outputText: "",
                outputNodesNumber: 1,
                attributes: {
                    'data-quot': '"quot"',
                    'data-apos': "'apos'"
                }
            },

            // ----------------------------------------------- modifier: default

            'automatic-modifier_default': {
                input: undefined,
                modifiers: {
                    'default': ["<div></div>"]
                },
                outputText: "<div></div>"
            },

            'nothing-modifier_default-before': {
                input: undefined,
                escape: false,
                modifiers: {
                    'default': ["<div></div>"]
                },
                outputText: "<div></div>"
            },
            'all-modifier_default-before': {
                input: undefined,
                escape: true,
                modifiers: {
                    'default': ["<div></div>"]
                },
                outputText: "<div></div>"
            },

            'all-modifier_default-after': {
                input: undefined,
                escape: true,
                modifiers: {
                    'default': ["<div></div>"]
                },
                outputText: "<div></div>"
            },


            'nothing-modifier_default-after': {
                input: undefined,
                escape: false,
                modifiers: {
                    'default': ["<div></div>"]
                },
                outputText: "",
                outputNodesNumber: 1
            },

            // ------------------------------------------------- modifier: empty

            'automatic-modifier_empty': {
                input: '',
                modifiers: {
                    empty: ['<div></div>']
                },
                outputText: "<div></div>"
            },

            'nothing-modifier_empty-before': {
                input: '',
                escape: false,
                modifiers: {
                    empty: ['<div></div>']
                },
                outputText: "<div></div>"
            },
            'all-modifier_empty-before': {
                input: '',
                escape: true,
                modifiers: {
                    empty: ['<div></div>']
                },
                outputText: "<div></div>"
            },

            'all-modifier_empty-after': {
                input: '',
                escape: true,
                modifiers: {
                    empty: ['<div></div>']
                },
                outputText: "<div></div>"
            },

            'nothing-modifier_empty-after': {
                input: '',
                escape: false,
                modifiers: {
                    empty: ['<div></div>']
                },
                outputNodesNumber: 1
            },

            // --------------------------------------------- modifier: highlight

            'automatic-modifier_highlight': {
                input: 'start-middle-end',
                modifiers: {
                    highlight: ['middle']
                },
                outputText: "start-<strong>middle</strong>-end"
            },

            'nothing-modifier_highlight-before': {
                input: 'start-middle-end',
                escape: false,
                modifiers: {
                    highlight: ['middle']
                },
                outputText: "start-<strong>middle</strong>-end"
            },

            'all-modifier_highlight-before': {
                input: 'start-middle-end',
                escape: true,
                modifiers: {
                    highlight: ['middle']
                },
                outputText: "start-<strong>middle</strong>-end"
            },
            'all-modifier_highlight-after': {
                input: 'start-middle-end',
                escape: true,
                modifiers: {
                    highlight: ['middle']
                },
                outputText: "start-<strong>middle</strong>-end"
            },

            'nothing-modifier_highlight-after': {
                input: 'start-middle-end',
                escape: false,
                modifiers: {
                    highlight: ['middle']
                },
                outputNodesNumber: 1
            },

            // -------------------------------------------- modifier: dateformat

            'automatic-modifier_dateformat': {
                input: this.date,
                modifiers: {
                    dateformat: [this.dateformat]
                },
                outputText: formattedDate
            },
            'nothing-modifier_dateformat-before': {
                input: this.date,
                escape: false,
                modifiers: {
                    dateformat: [this.dateformat]
                },
                outputText: formattedDate
            },
            'nothing-modifier_dateformat-after': {
                input: this.date,
                escape: false,
                modifiers: {
                    dateformat: [this.dateformat]
                },
                outputText: formattedDate
            },
            // This one should fail
            // 'all-modifier_dateformat-before': {
            //     input: this.date,
            //     escape: true,
            //     modifiers: {
            //         dateformat: [this.dateformat]
            //     },
            //     outputText: formattedDate
            // },
            // ----
            'all-modifier_dateformat-after': {
                input: this.date,
                escape: true,
                modifiers: {
                    dateformat: [this.dateformat]
                },
                outputText: formattedDate
            }
        };



        this.useCases = [];
        this.useCasesMap = {};
        this.inputsMap = {};

        this.__forOwn(useCasesSpecs, function(id, spec) {
            this.addUseCase(this.buildUseCase(id, spec));
        });

        this.setTestEnv({
            data: {
                useCases: this.useCasesMap,
                inputs: this.inputsMap,
                dateformat: this.dateformat,
                date: this.date
            }
        });
    },

    $prototype: {
        /***********************************************************************
         * Use cases
         **********************************************************************/

        buildUseCase : function(id, spec) {
            if (aria.utils.Type.isString(spec)) {
                spec = {
                    input: spec
                };
            }

            spec.id = id;

            return new this.UseCase(spec);
        },

        addUseCase : function(useCase) {
            this.useCases.push(useCase);
            this.useCasesMap[useCase.id] = useCase;
            this.inputsMap[useCase.id] = useCase.input;
        },

        UseCase: function(spec) {
            // -------------------------------------------------------------- id

            this.id = spec.id;

            // ----------------------------------------------------------- input

            var input = spec.input;
            this.input = input;

            // ---------------------------------------------------------- escape

            var escape = spec.escape;
            this.escape = escape;

            // ------------------------------------------------------- modifiers

            var modifiers = spec.modifiers;
            if (modifiers == null) {
                modifiers = {};
            }
            this.modifiers = modifiers;

            // ----------------------------------------------------- output text

            var outputText = spec.outputText;
            if (outputText == null) {
                outputText = input;
            }
            outputText = "" + outputText;
            this.outputText = outputText;

            // ------------------------------------------------- number of nodes

            var outputNodesNumber = spec.outputNodesNumber;
            if (outputNodesNumber == null) {
                outputNodesNumber = 0;
            }
            this.outputNodesNumber = outputNodesNumber;

            // ------------------------------------------------------ attributes

            var attributes = spec.attributes;
            this.attributes = attributes;
        },

        /***********************************************************************
         * Tests
         **********************************************************************/

        runTemplateTest: function() {
            this.__forEach(this.useCases, this.__testUseCase);

            this.end();
        },

        __testUseCase: function(index, useCase) {
            var domId = useCase.id;
            var expectedText = useCase.outputText;
            var expectedNumberOfNodes = useCase.outputNodesNumber;
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
