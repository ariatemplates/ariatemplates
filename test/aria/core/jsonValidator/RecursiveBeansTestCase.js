/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.core.jsonValidator.RecursiveBeansTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.JsonValidator", "test.aria.core.jsonValidator.RecursiveBeans"],
    $prototype : {

        _initialData : function () {
            return {
                value1 : 1,
                subTrees : [{
                            value2 : 0
                        }, {
                            value1 : 4,
                            subTrees : [{
                                        subTrees : [{
                                                    subTrees : []
                                                }, {
                                                    value1 : 2
                                                }]
                                    }]
                        }]
            };
        },

        _normalizedData : function () {
            return {
                value1 : 1,
                value2 : 7,
                subTrees : [{
                            value1 : 3,
                            value2 : 0,
                            subTrees : []
                        }, {
                            value1 : 4,
                            value2 : 7,
                            subTrees : [{
                                        value1 : 3,
                                        value2 : 7,
                                        subTrees : [{
                                                    value1 : 3,
                                                    value2 : 7,
                                                    subTrees : []
                                                }, {
                                                    value1 : 2,
                                                    value2 : 7,
                                                    subTrees : []
                                                }]
                                    }]
                        }]
            };
        },

        _checkNormalization : function () {
            var param = {
                json : this._initialData(),
                beanName : "test.aria.core.jsonValidator.RecursiveBeans.Tree"
            };
            var res = aria.core.JsonValidator.normalize(param);
            this.assertJsonEquals(param.json, this._normalizedData());
        },

        testExecuteNormalize : function () {
            // test in slow mode:
            this.assertTrue(aria.core.JsonValidator._options.checkEnabled, "This test is expected to be run with aria.core.JsonValidator._options.checkEnabled = true");
            this._checkNormalization();

            // test in fast mode:
            aria.core.JsonValidator._options.checkEnabled = false;
            this._checkNormalization();

            // reset initial mode:
            aria.core.JsonValidator._options.checkEnabled = true;
        }
    }
});