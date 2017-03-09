/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "SampleBeanTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.JsonValidator", "app.SampleBean"],
    $prototype : {

        _initialData : function () {
            return {
                value1 : 1,
                subTrees : [{
                            value2 : 0,
                            child : {},
                            ancestor3 : {},
                            ancestor2 : {},
                            ancestor1 : {}
                        }, {
                            value1 : 4,
                            structure : {},
                            subTrees : [{
                                        subTrees : [{
                                                    subTrees : []
                                                }, {
                                                    value1 : 2,
                                                    structure : {
                                                        value3 : 777
                                                    }
                                                }]
                                    }]
                        }]
            };
        },

        _normalizedData : function () {
            return {
                value1 : 1,
                value2 : 7,
                structure : {
                    value3 : 12,
                    value4 : 50
                },
                subTrees : [{
                            value1 : 3,
                            value2 : 0,
                            child : {
                                text1: "defChildTextV1",
                                text3: "defChildTextV3",
                                obj: {
                                    subProperty1: "defChildV1",
                                    subProperty2: "defChildV2"
                                },
                                text4: "defValue4",
                                text2: "defValue2"
                            },
                            ancestor3 : {
                                text1: "defValue1",
                                text3: "defValue3",
                                obj: {
                                    subProperty1: "defV1"
                                },
                                text4: "defValue4",
                                text2: "defValue2"
                            },
                            ancestor2 : {
                                text1: "defValue1",
                                text2: "defValue2",
                                obj: {
                                    subProperty1: "defV1"
                                }
                            },
                            ancestor1 : {
                                text1: "defValue1",
                                text2: "defValue2",
                                obj: {
                                    subProperty1: "defV1"
                                }
                            },
                            structure : {
                                value3 : 12,
                                value4 : 50
                            },
                            subTrees : []
                        }, {
                            value1 : 4,
                            value2 : 7,
                            structure : {
                                value3 : 12,
                                value4 : 70
                            },
                            subTrees : [{
                                        value1 : 3,
                                        value2 : 7,
                                        structure : {
                                            value3 : 12,
                                            value4 : 50
                                        },
                                        subTrees : [{
                                                    value1 : 3,
                                                    value2 : 7,
                                                    structure : {
                                                        value3 : 12,
                                                        value4 : 50
                                                    },
                                                    subTrees : []
                                                }, {
                                                    value1 : 2,
                                                    value2 : 7,
                                                    structure : {
                                                        value3 : 777,
                                                        value4 : 70
                                                    },
                                                    subTrees : []
                                                }]
                                    }]
                        }]
            };
        },

        _checkNormalization : function () {
            var param = {
                json : this._initialData(),
                beanName : "app.SampleBean.Tree"
            };
            var res = aria.core.JsonValidator.normalize(param);
            this.assertJsonEquals(param.json, this._normalizedData());
        },

        testExecuteNormalize : function () {
            this._checkNormalization();
        }
    }
});