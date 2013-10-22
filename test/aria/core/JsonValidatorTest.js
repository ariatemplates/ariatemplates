/* jshint -W010 : true */
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
 * Test case for the JSON validator
 */
Aria.classDefinition({
    $classpath : "test.aria.core.JsonValidatorTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.BaseTypes", "aria.widgets.CfgBeans", "test.aria.core.test.Beans"],
    $prototype : {

        setUp : function () {
            this.debug = aria.core.environment.Environment.isDebug();
            aria.core.environment.Environment.setDebug(true);
        },

        tearDown : function () {
            aria.core.environment.Environment.setDebug(this.debug);
        },

        /**
         * Validating the base types schema
         */
        testCheckBaseTypes : function () {
            var jv = aria.core.JsonValidator;
            var checkMT = jv._options.checkMultiTypes;
            jv._options.checkMultiTypes = true;
            var baseTypes = jv.__loadedBeans[jv._BASE_TYPES_PACKAGE];
            this.$assert(20, baseTypes != null);
            jv.check(baseTypes, "aria.core.BaseTypes.Package");
            jv._options.checkMultiTypes = checkMT;
        },

        /**
         * Validating the bean definition schema (with itself)
         */
        testAsyncCheckSchema : function () {
            var jv = aria.core.JsonValidator;
            var checkMT = jv._options.checkMultiTypes;
            jv._options.checkMultiTypes = true;
            var oSelf = this;
            aria.core.DownloadMgr.loadFile("aria/core/BaseTypes.js", {
                "fn" : this.checkSchemaEnd,
                "scope" : this,
                "args" : checkMT
            });
        },

        /**
         * Extract what is inside Aria.beanDefinitions in the schema string, returns it as an object.
         * @param {String} schema
         * @return {Object} parameter of Aria.beanDefinitions
         */
        evalSchema : function (schema) {
            var jv = aria.core.JsonValidator;
            var bean;
            var fakeAria = {
                beanDefinitions : function (arg) {
                    bean = arg;
                }
            };
            schema = "var module = arguments[2], require = module.require;\n" + schema;
            Aria["eval"](schema, null, {
                exports : {},
                require : function (requirement) {
                    if (/\/Aria(\.js)?$/.test(requirement)) {
                        return fakeAria;
                    }
                    if (/\/JsonTypes(\.js)?$/.test(requirement)) {
                        return jv.__loadedBeans["aria.core.JsonTypes"];
                    }
                    throw new Error("Unexpected require: " + requirement);
                }
            });
            return bean;
        },

        /**
         * testAsyncCheckSchema callback
         * @param {Object} cbArg
         * @param {Boolean} checkMT
         */
        checkSchemaEnd : function (cbArg, checkMT) {
            var jv = aria.core.JsonValidator;
            // download fails in packaged mode.
            if (!cbArg.downloadFailed) {
                var schema = aria.core.DownloadMgr.getFileContent("aria/core/BaseTypes.js");
                this.$assert(32, schema != null);
                var bean = this.evalSchema(schema);
                this.$assert(24, typeof(bean) == "object");
                jv.check(bean, "aria.core.BaseTypes.Package");
            }
            jv._options.checkMultiTypes = checkMT;
            this.notifyTestEnd("testAsyncCheckSchema");
        },

        /**
         * Check BeanDefinitions errors
         */
        testBeansDefinitionErrors : function () {
            var jv = aria.core.JsonValidator;
            var beansToTest = [{
                        skip : jv._options.checkMultiTypes,
                        errorMsgs : [jv.INVALID_TYPE_NAME],
                        beans : {
                            TestBean : {
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.INVALID_TYPE_REF],
                        beans : {
                            TestBean : {
                                $type : "InvalidBean",
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.UNDEFINED_PREFIX],
                        beans : {
                            TestBean : {
                                $type : "invalid:MyBean",
                                $description : ""
                            }
                        },
                        namespaces : null
                    }, {
                        errorMsgs : [jv.UNDEFINED_PREFIX],
                        beans : {
                            TestBean : {
                                $type : "invalid:MyBean",
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.MISSING_BEANSPACKAGE],
                        beans : {
                            TestBean : {
                                $type : "missing:MyBean",
                                $description : ""
                            }
                        },
                        namespaces : {
                            "missing" : "aria.jsunit.TestCase"
                        }
                    }, {
                        errorMsgs : [jv.RECURSIVE_BEAN],
                        beans : {
                            TestBean : {
                                $type : "TestBean",
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.BOTH_MANDATORY_DEFAULT],
                        beans : {
                            TestBean : {
                                $type : "json:String",
                                $description : "",
                                $mandatory : true,
                                $default : ""
                            }
                        }
                    }, {
                        skip : !jv._options.checkInheritance,
                        errorMsgs : [jv.INHERITANCE_EXPECTED],
                        beans : {
                            TestBean1 : {
                                $type : "json:Object",
                                $properties : {
                                    "prop1" : {
                                        $type : "json:String",
                                        $description : ""
                                    }
                                },
                                $description : ""
                            },
                            TestBean2 : {
                                $type : "TestBean1",
                                $properties : {
                                    "prop1" : {
                                        $type : "json:Integer",
                                        $description : ""
                                    }
                                },
                                $description : ""
                            }
                        }
                    }, {
                        skip : !jv._options.checkInheritance,
                        errorMsgs : [jv.INHERITANCE_EXPECTED],
                        beans : {
                            TestBean1 : {
                                $type : "json:Array",
                                $contentType : {
                                    $type : "json:String",
                                    $description : ""
                                },
                                $description : ""
                            },
                            TestBean2 : {
                                $type : "TestBean1",
                                $contentType : {
                                    $type : "json:Integer",
                                    $description : ""
                                },
                                $description : ""
                            }
                        }
                    }, {
                        skip : !jv._options.checkInheritance,
                        errorMsgs : [jv.INHERITANCE_EXPECTED],
                        beans : {
                            TestBean1 : {
                                $type : "json:Map",
                                $contentType : {
                                    $type : "json:String",
                                    $description : ""
                                },
                                $description : ""
                            },
                            TestBean2 : {
                                $type : "TestBean1",
                                $contentType : {
                                    $type : "json:Integer",
                                    $description : ""
                                },
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.ENUM_DUPLICATED_VALUE],
                        beans : {
                            TestBean : {
                                $type : "json:Enum",
                                $enumValues : ["val1", "val1"],
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.MISSING_CONTENTTYPE],
                        beans : {
                            TestBean : {
                                $type : "json:Array",
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.MISSING_CONTENTTYPE],
                        beans : {
                            TestBean : {
                                $type : "json:Map",
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.MISSING_ENUMVALUES],
                        beans : {
                            TestBean : {
                                $type : "json:Enum",
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.ENUM_INVALID_INHERITANCE],
                        beans : {
                            TestBean1 : {
                                $type : "json:Enum",
                                $enumValues : ["val1", "val2"],
                                $description : ""
                            },
                            TestBean2 : {
                                $type : "TestBean1",
                                $enumValues : ["val1", "val3"],
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.NUMBER_INVALID_INHERITANCE],
                        beans : {
                            TestBean1 : {
                                $type : "json:Integer",
                                $minValue : 3,
                                $description : ""
                            },
                            TestBean2 : {
                                $type : "TestBean1",
                                $minValue : 1,
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.NUMBER_INVALID_RANGE],
                        beans : {
                            TestBean : {
                                $type : "json:Integer",
                                $minValue : 3,
                                $maxValue : -1,
                                $description : ""
                            }
                        }
                    }, {
                        errorMsgs : [jv.INVALID_NAME],
                        beans : {
                            "my.bean" : {
                                $type : "json:Integer",
                                $description : ""
                            }
                        }
                    }, {
                        skip : !jv._options.checkDefaults,
                        errorMsgs : [jv.INVALID_DEFAULTVALUE],
                        beans : {
                            TestBean : {
                                $type : "json:Integer",
                                $default : "",
                                $description : ""
                            }
                        }
                    }, {
                        skip : !jv._options.checkBeans || jv._options.checkMultiTypes,
                        errorMsgs : [jv.BEANCHECK_FAILED],
                        beans : {
                            TestBean : {
                                $type : "json:Integer",
                                $unknownProperty : "",
                                $description : ""
                            }
                        }
                    }];

            for (var i = 0; i < beansToTest.length; i++) {
                var btt = beansToTest[i];
                if (btt.skip === true) {
                    continue;
                }
                var beanPackage = {
                    $package : "test.aria.core.test.InvalidBeans",
                    $description : "Bean package to test errors in preprocessing",
                    $namespaces : (btt.namespaces !== undefined ? btt.namespaces : {
                        "json" : "aria.core.JsonTypes"
                    }),
                    $beans : btt.beans
                };
                var exception = false;
                try {
                    // Aria.beanDefinitions is now supposed to raise an exception when it fails.
                    Aria.beanDefinitions(beanPackage);
                } catch (e) {
                    exception = true;
                }
                this.assertTrue(exception, "Aria.beanDefinitions should have raised an exception.");
                this.assertTrue(jv.__loadedBeans[beanPackage.$package] === undefined);
                for (var j = 0; j < btt.errorMsgs.length; j++) {
                    this.assertErrorInLogs(btt.errorMsgs[j]);
                }
                this.assertLogsEmpty();
            }
        },

        /**
         * Doing tests to process all base types
         */
        testTypeValidation : function () {
            var jv = aria.core.JsonValidator;
            var seq = new aria.core.Sequencer();
            var thingsToTest = [{
                        beanName : "StringTest",
                        json : ""
                    }, {
                        beanName : "StringTest",
                        json : "this is a\n test"
                    }, {
                        beanName : "StringTest",
                        json : true,
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "StringRegExpTest",
                        json : "myRegexp"
                    }, {
                        beanName : "StringRegExpTest",
                        json : "mynewRegexp"
                    }, {
                        beanName : "StringRegExpTest",
                        json : "myRegexps",
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "InheritStringRegExpTest",
                        json : "mynewRegexp"
                    }, {
                        beanName : "InheritStringRegExpTest",
                        json : "myRegexp",
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "InheritStringRegExpTest",
                        json : "myRegexps",
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "BooleanTest",
                        json : true
                    }, {
                        beanName : "BooleanTest",
                        json : false
                    }, {
                        beanName : "BooleanTest",
                        json : "true",
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "IntegerTest",
                        json : 0
                    }, {
                        beanName : "IntegerTest",
                        json : -44
                    }, {
                        beanName : "IntegerTest",
                        json : 38
                    }, {
                        beanName : "IntegerTest",
                        json : 0.2,
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "IntegerTest",
                        json : "0",
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "IntegerTest",
                        json : -100
                    }, {
                        beanName : "IntegerTest",
                        json : 200
                    }, {
                        beanName : "IntegerTest",
                        json : -101,
                        errorMsg : jv.NUMBER_RANGE
                    }, {
                        beanName : "IntegerTest",
                        json : 201,
                        errorMsg : jv.NUMBER_RANGE
                    }, {
                        beanName : "FloatTest",
                        json : 0.2
                    }, {
                        beanName : "FloatTest",
                        json : 1
                    }, {
                        beanName : "FloatTest",
                        json : -0.5
                    }, {
                        beanName : "FloatTest",
                        json : -100.1
                    }, {
                        beanName : "FloatTest",
                        json : 200.2
                    }, {
                        beanName : "FloatTest",
                        json : -100.11,
                        errorMsg : jv.NUMBER_RANGE
                    }, {
                        beanName : "FloatTest",
                        json : 200.22,
                        errorMsg : jv.NUMBER_RANGE
                    }, {
                        beanName : "FloatTest",
                        json : "0.2",
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "DateTest",
                        json : "12/12/2012"
                    }, {
                        beanName : "DateTest",
                        json : "null date",
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "RegExpTest",
                        json : /myRegExp/
                    }, {
                        beanName : "RegExpTest",
                        json : {},
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "ObjectRefTest",
                        json : {}
                    }, {
                        beanName : "ObjectRefTest",
                        json : 0,
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "FunctionRefTest",
                        json : function () {}
                    }, {
                        beanName : "FunctionRefTest",
                        json : {},
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "FunctionRefTest",
                        json : 0,
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "JsonPropertyTest",
                        json : "name"
                    }, {
                        beanName : "JsonPropertyTest",
                        json : Aria.FRAMEWORK_PREFIX + "name"
                    }, {
                        beanName : "JsonPropertyTest",
                        json : "extends",
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "EnumTest",
                        json : "myValue1"
                    }, {
                        beanName : "EnumTest",
                        json : "myValue2"
                    }, {
                        beanName : "EnumTest",
                        json : "myValue3",
                        errorMsg : jv.ENUM_UNKNOWN_VALUE
                    }, {
                        beanName : "ObjectTest",
                        json : {}
                    }, {
                        beanName : "ObjectTest",
                        json : {
                            property1 : "myRegexp"
                        }
                    }, {
                        beanName : "ObjectTest",
                        json : {
                            property1 : "invalidType"
                        },
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "ObjectTest",
                        json : {
                            undefinedProperty : "myvalue"
                        },
                        errorMsg : jv.UNDEFINED_PROPERTY
                    }, {
                        beanName : "ObjectTest",
                        json : {
                            "aria:acceptedmetadata" : "myvalue"
                        }
                    }, {
                        beanName : "ArrayTest",
                        json : []
                    }, {
                        beanName : "ArrayTest",
                        json : ["myRegexp"]
                    }, {
                        beanName : "ArrayTest",
                        json : ["invalidType"],
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "ArrayTest",
                        json : {},
                        errorMsg : jv.INVALID_TYPE_VALUE
                    }, {
                        beanName : "MapTest",
                        json : {}
                    }, {
                        beanName : "MapTest",
                        json : {
                            "value1" : "myRegexp"
                        }
                    }, {
                        beanName : "MapTest",
                        json : {
                            "value1" : "invalidType"
                        },
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "MultiTypesTest",
                        json : "string"
                    }, {
                        beanName : "MultiTypesTest",
                        json : 57
                    }, {
                        beanName : "MultiTypesTest",
                        json : 0.25
                    }, {
                        beanName : "MultiTypesTest",
                        json : ["an array"]
                    }, {
                        beanName : "MultiTypesTest",
                        json : {
                            "any" : "type"
                        }
                    }, {
                        beanName : "MandatoryTest",
                        json : {}
                    }, {
                        beanName : "MandatoryTest",
                        json : null,
                        errorMsg : jv.MISSING_MANDATORY
                    }, {
                        beanName : "MandatoryTest",
                        json : undefined,
                        errorMsg : jv.MISSING_MANDATORY
                    }, {
                        beanName : "NotMandatoryTest",
                        json : null
                    }, {
                        beanName : "ObjectRefTest",
                        json : null
                    }, {
                        beanName : "SequencerTest",
                        json : seq
                    }, {
                        beanName : "SequencerTest",
                        json : new Object(),
                        errorMsg : jv.NOT_OF_SPECIFIED_CLASSPATH
                    }, {
                        beanName : "MapTestWithKeyType",
                        json : {
                            "incorrectKey" : true
                        },
                        errorMsg : jv.REGEXP_FAILED
                    }, {
                        beanName : "MapTestWithKeyType",
                        json : {
                            "oki" : true
                        }
                    }];
            for (var i = 0; i < thingsToTest.length; i++) {
                var ttt = thingsToTest[i];
                jv.check(ttt.json, "test.aria.core.test.Beans." + ttt.beanName);
                if (ttt.errorMsg != null) {
                    this.assertErrorInLogs(ttt.errorMsg);
                }
                this.assertLogsEmpty();
            }
            seq.$dispose();
        },

        /**
         * Test case added for the special case of complex objects used with the fast normalization
         */
        testComplexObjectWithFastNormalization : function () {
            var jv = aria.core.JsonValidator;

            var json = {
                subObject : {}
            };

            // Alternatively, we could use the following :
            var beanDef = jv._getBean("test.aria.core.test.Beans.ComplexObjectTest");
            json = beanDef.$fastNorm(json);

            // What we really want to test here is normalize, but only in non-debug mode.
            // Explanations and alternative implementation below :
            /*
             * // This can only be checked with fast normalization enabled // In debug mode, fast normalization is not
             * used // We can not simply temporarily set Aria.debug to false, // since its value is copied in an
             * internal option of the JsonValidator var backupValue = jv._options.checkEnabled ;
             * jv._options.checkEnabled = false; jv.normalize({ json : json, beanName :
             * "test.aria.core.test.Beans.ComplexObjectTest" }); jv._options.checkEnabled = backupValue;
             */

            this.assertTrue(json.subObject.subSubObject && json.subObject.subSubObject.property1 == "someString", "Normalization failed for a complex object : the default value of a nested property was not correctly set");
        },

        /**
         * Test case for normalization in debug mode
         */
        testDebugNormalization : function () {
            var test = {};
            aria.core.JsonValidator.normalize({
                json : test,
                beanName : "test.aria.core.test.Beans.InheritanceBase"
            });
            this.assertTrue(!("property1" in test), "Property from child is set on parent");
        },

        testEscapedDefaultNormalization : function () {
            var test = {};
            aria.core.JsonValidator.normalize({
                json : test,
                beanName : "test.aria.core.test.Beans.DefaultTest"
            });
            this.assertTrue("text/html" in test.myObject, "Property 'text/html' is not correctly set");
            this.assertLogsEmpty();

        },

        testDefaultValuesWithInheritanceAndObjectsFastNorm : function () {
            aria.core.environment.Environment.setDebug(false); // check fast normalization
            var param = {
                json : null,
                beanName : "test.aria.core.test.Beans.InheritanceExtended"
            };
            aria.core.JsonValidator.normalize(param);
            this.assertTrue(param.json != null);
            this.assertTrue(param.json.property1 == "someString");
        },

        testDefaultValuesWithInheritanceAndObjectsSlowNorm : function () {
            aria.core.environment.Environment.setDebug(true); // check slow normalization
            var param = {
                json : null,
                beanName : "test.aria.core.test.Beans.InheritanceExtended"
            };
            aria.core.JsonValidator.normalize(param);
            this.assertTrue(param.json != null);
            this.assertTrue(param.json.property1 == "someString");
        }
    }
});
