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
    $classpath: "test.aria.templates.statements.escape.ExpressionEscapeTestCase",
    $extends: "test.aria.templates.statements.escape.ExpressionEscapeBase",
    $dependencies: ["aria.utils.Date"],

    $constructor : function() {
        this.date = new Date();
        this.dateformat = "dd MMMM yyyy";

        // ---------------------------------------------------------------------

        this.$ExpressionEscapeBase.constructor.call(this, arguments);

        // ---------------------------------------------------------------------

        this.data.dateformat = this.dateformat;
        this.data.date = this.date;
    },

    $prototype: {
        _getUseCasesSpecs: function() {
            var formattedDate = aria.utils.Date.format(this.date, this.dateformat);

            // Please refer to the associated template to understand the following
            // The keys of the object correspond to the ids of the "div"s encapsulating each tested use case
            // By looking at the template, you will know what the use case is about (the id gives a hint about it too). You will also see what is the input and when the escaping is expected to be done.
            // Below, you will see for each of these cases what is the expected content in the resulting HTML Text Node (inside the div), as well as the number of possibly other generated HTML nodes.

            return {
                'automatic': "<div class='output' style=\"color:blue\">&amp;</div>",

                // -------------------------------------------------------------

                'all-implicit': "<div class='output' style=\"color:blue\">&amp;</div>",

                'all-boolean': {
                    input: "<div class='output' style=\"color:blue\">&amp;</div>",
                    escape: true
                },

                'all-object': {
                    input: "<div class='output' style=\"color:blue\">&amp;</div>",
                    escape: {text: true, attr: true}
                },

                // -------------------------------------------------------------

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

                // -------------------------------------------------------------

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

                // ------------------------------------------- modifier: default

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

                // --------------------------------------------- modifier: empty

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

                // ----------------------------------------- modifier: highlight

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

                // ---------------------------------------- modifier: dateformat

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
                // -------------------------------------------------------------
                'all-modifier_dateformat-after': {
                    input: this.date,
                    escape: true,
                    modifiers: {
                        dateformat: [this.dateformat]
                    },
                    outputText: formattedDate
                }
            };
        }
    }
});
