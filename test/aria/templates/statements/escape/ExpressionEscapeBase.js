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
    $classpath: "test.aria.templates.statements.escape.ExpressionEscapeBase",
    $extends: "aria.jsunit.TemplateTestCase",
    $dependencies: ["aria.utils.String", "aria.utils.Type"],

    $constructor: function() {
        this.$TemplateTestCase.constructor.call(this, arguments);

        // ---------------------------------------------------------------------

        var useCasesSpecs = this._getUseCasesSpecs();

        this.useCases = [];
        this.useCasesMap = {};
        this.inputsMap = {};

        this._forOwn(useCasesSpecs, function(id, spec) {
            this.addUseCase(this.buildUseCase(id, spec));
        });

        // ---------------------------------------------------------------------

        this.data = {
            useCases: this.useCasesMap,
            inputs: this.inputsMap
        };

        this.setTestEnv({data: this.data});
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

            // ----------------------------------------------------------- preCb

            var preCb = spec.preCb;
            if (!aria.utils.Type.isFunction(preCb)) {
                preCb = Aria.empty;
            }
            this.preCb = preCb;

            // ---------------------------------------------------------- postCb

            var postCb = spec.postCb;
            if (!aria.utils.Type.isFunction(postCb)) {
                postCb = Aria.empty;
            }
            this.postCb = postCb;

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
            this._forEach(this.useCases, this.__testUseCase);

            this.end();
        },

        __testUseCase: function(index, useCase) {
            var domId = useCase.id;
            var expectedText = useCase.outputText;
            var expectedNumberOfNodes = useCase.outputNodesNumber;
            var attributes = useCase.attributes;
            var preCb = useCase.preCb;
            var postCb = useCase.postCb;

            // Pre hook --------------------------------------------------------

            preCb(useCase);

            // Results extraction ----------------------------------------------

            var element = this.getElementById(domId);

            // ---------------------------------------- text content of the node

            var textContent = element.textContent || element.innerText || element.nodeValue || "";
            textContent = textContent.replace(/\n/g, '');
            textContent = textContent.replace(/^\s+|\s+$/g, '');

            // --------------- number of children nodes which are not text nodes

            var numberOfChildren = 0;
            var children = element.childNodes;

            this._forEach(children, function(index, child) {
                if (child.nodeType === 1) {
                    numberOfChildren++;
                }
            });



            // Assertions ------------------------------------------------------

            // ---------------------------------------------------- text content

            this.assertEquals(
                textContent,
                expectedText,

                this._formatErrorMessage("Wrong text content.", [
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

                this._formatErrorMessage("Wrong number of children nodes.", [
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

                this._forOwn(attributes, function(attrName, expectedAttrValue) {
                    var attrValue = child.getAttribute(attrName);

                    this.assertEquals(
                        attrValue,
                        expectedAttrValue,

                        this._formatErrorMessage("Wrong attributes.", [
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

            // Post hook -------------------------------------------------------

            postCb(useCase);
        },



        /***********************************************************************
         * Test helpers
         **********************************************************************/

        _formatErrorMessage : function(message, properties) {
            var outputParts = [];

            outputParts.push(message);

            this._forEach(properties, function(index, property) {
                var label = property.label;
                var value = property.value;

                outputParts.push(label + ": " + value);
            });

            return outputParts.join(" | ");
        },



        /***********************************************************************
         * Helpers
         **********************************************************************/

        _forOwn: function(collection, callback, thisArg) {
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

        _forEach : function(collection, callback, thisArg) {
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
