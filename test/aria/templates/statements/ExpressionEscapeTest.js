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
    $classpath : 'test.aria.templates.statements.ExpressionEscapeTest',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.utils.Dom'],
    $prototype : {
        runTemplateTest : function () {
            var nonBackwardCompatibleCases = {
                // The following use cases test the standard application of the escaping both with a default application
                // and an explicit use of the modifier
                'default' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'implicit' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'all-boolean' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },
                'all-object' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'nothing-boolean' : {
                    outputText : "&",
                    outputNodesNumber : 1

                },
                'nothing-object' : {
                    outputText : "&",
                    outputNodesNumber : 1
                },

                'attr' : {
                    outputText : "&",
                    outputNodesNumber : 1
                },
                'text' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'special-attr' : {
                    outputText : "",
                    outputNodesNumber : 1,
                    attributes : {
                        'data-quot' : '"quot"',
                        'data-apos' : "'apos'"
                    }
                },

                // The following use cases just test the behavior of the escaping with the specific unsafe modifiers
                // (default and empty), both with a default application and an explicit use of the escaping modifier
                'default-modifier-default' : {
                    outputText : "<div></div>"
                },
                'nothing-modifier-default-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'nothing-modifier-default-after' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-default-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-default-after' : {
                    outputText : "<div></div>"
                },

                'default-modifier-empty' : {
                    outputText : "<div></div>"
                },
                'nothing-modifier-empty-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'nothing-modifier-empty-after' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-empty-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-empty-after' : {
                    outputText : "<div></div>"
                }
            };

            var backwardCompatibleCases = {
                // The following use cases test the standard application of the escaping both with a default application
                // and an explicit use of the modifier
                'default' : {
                    outputText : "&",
                    outputNodesNumber : 1
                },

                'implicit' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'all-boolean' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },
                'all-object' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'nothing-boolean' : {
                    outputText : "&",
                    outputNodesNumber : 1

                },
                'nothing-object' : {
                    outputText : "&",
                    outputNodesNumber : 1
                },

                'attr' : {
                    outputText : "&",
                    outputNodesNumber : 1
                },
                'text' : {
                    outputText : "<div class='output' style=\"color:blue\">&amp;</div>"
                },

                'special-attr' : {
                    outputText : "",
                    outputNodesNumber : 1,
                    attributes : {
                        'data-quot' : '"quot"',
                        'data-apos' : "'apos'"
                    }
                },

                // The following use cases just test the behavior of the escaping with the specific unsafe modifiers
                // (default and empty), both with a default application and an explicit use of the escaping modifier
                'default-modifier-default' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'nothing-modifier-default-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'nothing-modifier-default-after' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-default-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-default-after' : {
                    outputText : "<div></div>"
                },

                'default-modifier-empty' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'nothing-modifier-empty-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'nothing-modifier-empty-after' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-empty-before' : {
                    outputText : "",
                    outputNodesNumber : 1
                },
                'all-modifier-empty-after' : {
                    outputText : "<div></div>"
                }
            };

            var cases = nonBackwardCompatibleCases;

            /* Begin non backward compatible change */
            var cases = backwardCompatibleCases;
            /* End non backward compatible change */

            for (var id in cases) {
                if (cases.hasOwnProperty(id)) {
                    var useCase = cases[id];

                    // Gets expected results from
                    var expectedText = useCase.outputText || "";
                    var expectedNumberOfNodes = useCase.outputNodesNumber || 0;

                    var element = this.getElementById(id);

                    // Computes the text content of the node
                    var textContent = element.textContent || element.innerText || element.nodeValue || "";
                    textContent = textContent.replace(/\n/g, '');

                    // Computes the number of children nodes which are not text nodes
                    var numberOfChildren = 0;
                    var children = element.childNodes;
                    for (var i = 0, length = children.length; i < length; i++) {
                        var child = children[i];
                        if (child.nodeType === 1) {
                            numberOfChildren++;
                        }
                    }

                    // Assertions
                    this.assertTrue(textContent === expectedText, "Expression escape failed: \n\tId = " + id
                            + "\n\tText content = " + textContent + "\n\tExpected text = " + expectedText);
                    this.assertTrue(numberOfChildren === expectedNumberOfNodes, "Expression escape failed: \n\tId = "
                            + id + "\n\Number of children = " + numberOfChildren + "\n\tExpected number of children = "
                            + expectedNumberOfNodes);

                    // Additional assertions in case of attributes specifications
                    var attributes = useCase.attributes;
                    if (attributes !== undefined && attributes !== null) {
                        var child = element.getElementsByTagName("div")[0];
                        for (var attrName in attributes) {
                            if (attributes.hasOwnProperty(attrName)) {
                                var expectedAttrValue = attributes[attrName];
                                var attrValue = child.getAttribute(attrName);

                                this.assertTrue(attrValue === expectedAttrValue, "Expression escape failed: \n\tId = "
                                        + id + "\n\Attribute name = " + attrName + "\n\tAttribute value = " + attrValue
                                        + "\n\tExpected attribute value = " + expectedAttrValue);
                            }
                        }
                    }
                }
            }

            this.end();
        }
    }
});
