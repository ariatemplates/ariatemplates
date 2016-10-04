/*
 * Copyright 2016 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');

var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsString = require('ariatemplates/utils/String');
var subst = ariaUtilsString.substitute;



module.exports = Aria.tplScriptDefinition({
    $classpath: 'test.aria.utils.domNavigationManager.TplScript',

    $prototype: {
        ////////////////////////////////////////////////////////////////////////
        // Data
        ////////////////////////////////////////////////////////////////////////

        $dataReady: function() {
            // -----------------------------------------------------------------

            var data = this.data;

            // -----------------------------------------------------------------

            var elements = {};
            data.elements = elements;

            var before = {
                id: 'element_before',
                content: 'focus me'
            };
            elements.before = before;

            // -----------------------------------------------------------------

            var elementsTree = {
                name: 'root',
                children: [
                    {
                        name: '1',
                        children: [
                            {
                                name: '1.1',
                                children: [
                                    {name: '1.1.1', children: []},
                                    {name: '1.1.2', children: []},
                                    {name: '1.1.3', children: []}
                                ]
                            },
                            {
                                name: '1.2',
                                children: [
                                    {name: '1.2.1', children: []},
                                    {name: '1.2.2', children: []},
                                    {name: '1.2.3', children: []}
                                ]
                            },
                            {
                                name: '1.3',
                                children: [
                                    {name: '1.3.1', children: []},
                                    {name: '1.3.2', children: []},
                                    {name: '1.3.3', children: []}
                                ]
                            }
                        ]
                    },
                    {
                        name: '2',
                        children: [
                            {
                                name: '2.1',
                                children: [
                                    {name: '2.1.1', children: []},
                                    {name: '2.1.2', children: []},
                                    {name: '2.1.3', children: []}
                                ]
                            },
                            {
                                name: '2.2',
                                children: [
                                    {name: '2.2.1', children: []},
                                    {name: '2.2.2', children: []},
                                    {name: '2.2.3', children: []}
                                ]
                            },
                            {
                                name: '2.3',
                                children: [
                                    {name: '2.3.1', children: []},
                                    {name: '2.3.2', children: []},
                                    {name: '2.3.3', children: []}
                                ]
                            }
                        ]
                    },
                    {
                        name: '3',
                        children: [
                            {
                                name: '3.1',
                                children: [
                                    {name: '3.1.1', children: []},
                                    {name: '3.1.2', children: []},
                                    {name: '3.1.3', children: []}
                                ]
                            },
                            {
                                name: '3.2',
                                children: [
                                    {name: '3.2.1', children: []},
                                    {name: '3.2.2', children: []},
                                    {name: '3.2.3', children: []}
                                ]
                            },
                            {
                                name: '3.3',
                                children: [
                                    {name: '3.3.1', children: []},
                                    {name: '3.3.2', children: []},
                                    {name: '3.3.3', children: []}
                                ]
                            }
                        ]
                    }
                ]
            };
            data.elementsTree = elementsTree;
        }
    }
});
