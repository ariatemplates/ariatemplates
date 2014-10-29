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
 * Test cases for aria.utils.Data
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Data",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Data", "aria.utils.validators.Number", "aria.utils.validators.Mandatory",
            "aria.utils.validators.MultipleValidator"],
    $prototype : {
        /**
         * Test case for _getMeta. Checks the returned json structure.
         */
        test_getMeta : function () {
            var dataHolder = {
                "aria:meta::test1" : {
                    "testMetaA" : true,
                    "testMetaB" : true
                },
                "aria:meta::test2" : {
                    "testMetaA" : false,
                    "testMetaB" : false
                },
                "aria:meta::test3" : {
                    "testMetaA" : true,
                    "testMetaB" : false
                }
            };
            var dataName = "test2";
            var check = {
                "testMetaA" : false,
                "testMetaB" : false
            };
            var test = aria.utils.Data._getMeta(dataHolder, dataName);
            this.assertJsonEquals(test, check);
        },

        /**
         * Test case for getValidator Checks the returned class.
         */
        test_getValidator : function () {
            var dataHolder = {
                "aria:meta::test" : {
                    "validator" : {
                        "testValidator" : true
                    }
                }
            };
            var dataName = "test";
            var check = {
                "testValidator" : true
            };
            var test = aria.utils.Data.getValidator(dataHolder, dataName);
            this.assertJsonEquals(test, check);
        },

        /**
         * Test the validateModel method
         */
        test_validateModel : function (group) {
            var data = {
                param1 : 'value1',
                param2 : [{
                            elem1 : 'value2'
                        }, {
                            elem2 : 'value3'
                        }, "thirdElement", false]
            }, utilData = aria.utils.Data;

            var numberValidator = new aria.utils.validators.Number();
            var length2Validator = new aria.utils.validators.Validator();
            length2Validator.validate = function (value) {
                if (value && value.length == 2) {
                    return this._validationSucceeded();
                } else {
                    return this._validationFailed();
                }
            };

            var notNullValidator = new aria.utils.validators.Validator();
            notNullValidator.validate = function (value) {
                if (value) {
                    return this._validationSucceeded();
                } else {
                    return this._validationFailed();
                }
            };

            utilData.setValidator(data, 'param1', numberValidator);
            utilData.setValidator(data.param2[1], 'elem2', numberValidator);
            utilData.setValidator(data, 'param2', length2Validator);
            utilData.setValidator(data.param2, 3, notNullValidator);

            var messages = {};
            utilData.validateModel(data, messages);
            this.assertTrue(messages.nbrOfE == 4, "There should be 4 messages in the list of messages");

            // updates datamodel to make things valid
            data.param2[1].elem2 = "13";
            data.param2.pop();
            data.param2.pop();

            messages = {};
            utilData.validateModel(data, messages);
            this.assertTrue(messages.nbrOfE == 1, "There should be 1 messages in the list of messages");

            // remove the validator on param1
            utilData.setValidator(data, 'param1', null);

            messages = {};
            utilData.validateModel(data, messages);
            this.assertTrue(!messages.nbrOfE, "There should be 0 messages in the list of messages");

            // add a framework message on param1
            var meta = utilData._getMeta(data, 'param1', false);
            meta.formatErrorMessages = ["this is an error message"];
            utilData.validateModel(data, messages);
            this.assertTrue(messages.nbrOfE == 1, "There should be 1 messages in the list of messages");

            numberValidator.$dispose();
            length2Validator.$dispose();
            notNullValidator.$dispose();
        },

        /**
         * Test the validateModel method with the stopOnError parameter set to true
         */
        test_validateModelStopOnError : function (group) {
            var data = {
                param1 : 'value1',
                param2 : [{
                            elem1 : 'value2'
                        }, {
                            elem2 : 'value3'
                        }, "thirdElement", null]
            }, utilData = aria.utils.Data;

            var numberValidator = new aria.utils.validators.Number();
            var mandatoryValidator = new aria.utils.validators.Mandatory();
            var length2Validator = new aria.utils.validators.Validator();
            length2Validator.validate = function (value) {
                if (value && value.length == 2) {
                    return this._validationSucceeded();
                } else {
                    return this._validationFailed();
                }
            };

            var notNullValidator = new aria.utils.validators.Validator();
            notNullValidator.validate = function (value) {
                if (value) {
                    return this._validationSucceeded();
                } else {
                    return this._validationFailed();
                }
            };

            utilData.setValidator(data, 'param1', mandatoryValidator);
            utilData.setValidator(data.param2[1], 'elem2', numberValidator);
            utilData.setValidator(data, 'param2', length2Validator);
            utilData.setValidator(data.param2, 3, notNullValidator);

            this._checkValidation(data, length2Validator);

            utilData.setValidator(data, 'param2', mandatoryValidator);

            this._checkValidation(data, numberValidator);

            // updates datamodel to make things valid
            data.param2[1].elem2 = "13";

            this._checkValidation(data, notNullValidator);

            numberValidator.$dispose();
            mandatoryValidator.$dispose();
            length2Validator.$dispose();
            notNullValidator.$dispose();
        },

        _checkValidation : function (data, validator) {
            var messages = {};
            aria.utils.Data.validateModel(data, messages, null, true);
            this.assertEquals(messages.nbrOfE, 1, "There should be only 1 message in the list of messages");
            this.assertEquals(messages.listOfMessages[0].metaDataRef.validator, validator, "The validator that returned error does not correspond to the expected one: %1 != %2");
        },

        /**
         * test processMessages method
         */
        test_processMessages : function () {

            var warn1 = {
                type : aria.utils.Data.TYPE_WARNING,
                localizedMessage : "msg1",
                code : "Message Code",
                fieldRef : "param1",
                subMessages : []
            };

            var err1 = {
                type : aria.utils.Data.TYPE_ERROR,
                localizedMessage : "msg2",
                code : "Message Code",
                fieldRef : "param2.param3",
                subMessages : []
            };

            var err2 = {
                type : aria.utils.Data.TYPE_ERROR,
                localizedMessage : "msg3",
                code : "Message Code",
                fieldRef : "param2.param4[0].param5",
                subMessages : []
            };

            // error with invalid fieldRef
            var err3 = {
                type : aria.utils.Data.TYPE_ERROR,
                localizedMessage : "msg4",
                code : "Message Code",
                fieldRef : "param2.param7.param8",
                subMessages : []
            };

            // creates nested error
            err1.subMessages.push(err2);

            var newMessages = [warn1, err1, err3];

            var data = {
                param1 : "test",
                param2 : {
                    param3 : "test",
                    param4 : [{
                                param5 : "test"
                            }]
                }
            };
            var messages = {};

            aria.utils.Data.processMessages(newMessages, data, messages);

            // check messages
            this.assertTrue(messages.nbrOfE == 3);
            this.assertTrue(messages.nbrOfW == 1);

            // one error is nested, there should be only 3 messages
            this.assertTrue(messages.listOfMessages.length == 3);

            // check metadatas in data
            // no metadata for param1, has this is a warning
            this.assertFalse(aria.utils.Data.META_PREFIX + "param1" in data);

            this.assertTrue(aria.utils.Data._getMeta(data.param2, "param3").error);
            this.assertTrue(aria.utils.Data._getMeta(data.param2, "param3").errorMessages[0] == "msg2");

            // nested errors have to be in the datamodel as well
            this.assertTrue(aria.utils.Data._getMeta(data.param2.param4[0], "param5").error);
            this.assertTrue(aria.utils.Data._getMeta(data.param2.param4[0], "param5").errorMessages[0] == "msg3");

            // fieldRef : "param2.param7.param8" should have raised an error
            this.assertErrorInLogs(aria.utils.Data.RESOLVE_FAIL);
        },

        /**
         * Test createMessage method.
         */
        test_createMessage : function () {
            // test default values
            var test = aria.utils.Data.createMessage("msg1");
            this.assertTrue(test.code == null);
            this.assertTrue(!("subMessages" in test));
            this.assertTrue(test.type == aria.utils.Data.TYPE_ERROR);
            this.assertTrue(test.localizedMessage == "msg1");

            // test complete definition
            var subMessages = [];
            test = aria.utils.Data.createMessage("msg2", "locMsg2", aria.utils.Data.TYPE_WARNING, "code", subMessages);
            this.assertTrue(test.code == "code");
            this.assertTrue(test.subMessages == subMessages);
            this.assertTrue(test.type == aria.utils.Data.TYPE_WARNING);
            this.assertTrue(test.localizedMessage == "locMsg2");
        },

        test_addMessage : function () {

            var messages = {};

            var warn1 = {
                type : aria.utils.Data.TYPE_WARNING,
                localizedMessage : "msg1",
                code : "Message Code",
                subMessages : []
            };

            aria.utils.Data.addMessage(warn1, messages);

            var err1 = {
                type : aria.utils.Data.TYPE_ERROR,
                localizedMessage : "msg2",
                code : "Message Code",
                subMessages : []
            };

            var err2 = {
                type : aria.utils.Data.TYPE_ERROR,
                localizedMessage : "msg3",
                code : "Message Code",
                subMessages : []
            };

            // creates nested error
            err1.subMessages.push(err2);

            aria.utils.Data.addMessage(err1, messages);

            this.assertTrue(messages.nbrOfE == 2, "There should be 2 error messages in the list of messages");
            this.assertTrue(messages.nbrOfW == 1, "There should be 1 warning message in the list of messages");
            this.assertTrue(messages.listOfMessages.length == 2);

        },

        /**
         * Test setValidator method.
         */
        test_setValidator : function () {
            var numberValidator = new aria.utils.validators.Number();
            var data = {
                param1 : 'value1'
            };
            aria.utils.Data.setValidator(data, "param1", numberValidator);
            var validatorSet = data[aria.utils.Data.META_PREFIX + "param1"].validator;
            this.assertTrue(validatorSet === numberValidator);
            numberValidator.$dispose();
        },

        /**
         * Test unsetValidator method.
         */
        test_unsetValidator : function () {
            var numberValidator = new aria.utils.validators.Number();
            var data = {
                param1 : 'value1'
            };
            aria.utils.Data.setValidator(data, "param1", numberValidator);
            aria.utils.Data.unsetValidator(data, "param1");
            var validatorSet = data[aria.utils.Data.META_PREFIX + "param1"].validator;
            this.assertFalse(validatorSet === numberValidator);
            numberValidator.$dispose();
        },

        /**
         * Tests setting the groups property of a validator
         */
        test_setValidatorGroups : function () {
            var numberValidator = new aria.utils.validators.Number();
            var data = {
                param1 : 'value1'
            };
            aria.utils.Data.setValidator(data, "param1", numberValidator, ["number"]);
            var validatorSet = data[aria.utils.Data.META_PREFIX + "param1"].validator;
            this.assertTrue(validatorSet.groups[0] === "number");
            numberValidator.$dispose();
        },

        /**
         * Tests setting the events property of a validator
         */
        test_setValidatorProperties : function () {
            var numberValidator = new aria.utils.validators.Number();
            var data = {
                param1 : 'value1'
            };
            aria.utils.Data.setValidatorProperties(numberValidator, ["number"], "onblur");
            this.assertTrue(numberValidator.eventToValidate === "onblur");
            numberValidator.$dispose();
        },

        test_checkEventToValidate : function () {
            var event = "onsubmit";
            var multipleValidator = new aria.utils.validators.MultipleValidator(null, null, "onsubmit");
            var mandatoryValidator = new aria.utils.validators.Mandatory("test_checkEventToValidate");
            multipleValidator.add({
                validator : mandatoryValidator,
                event : "onblur"
            });
            this.assertTrue(aria.utils.Data.checkEventToValidate(multipleValidator.eventToValidate, "onsubmit"));
            this.assertFalse(aria.utils.Data.checkEventToValidate(multipleValidator.validators[0].eventToValidate, "onsubmit"));
            multipleValidator.$dispose();
            mandatoryValidator.$dispose();
        },

        test_singleValidatorEventToValidate : function () {
            var data = {
                param1 : null
            };
            var validator = new aria.utils.validators.Mandatory("Single Validator");
            aria.utils.Data.setValidator(data, "param1", validator);
            var res = aria.utils.Data.validateValue(data, "param1", null, null, "onblur"); // In this test a single
            // validator has a different
            // event to validate from
            // the the triggering event
            // so no validation will
            // occur.
            var check = (!res) ? false : true;
            this.assertFalse(check);
            aria.utils.Data.setValidatorProperties(validator, null, "onblur");
            var res = aria.utils.Data.validateValue(data, "param1", null, null, "onblur"); // In this test a single
            // validator has the same
            // event to validate as the
            // triggering event so
            // validation will occur.
            check = (!res) ? false : true;
            this.assertTrue(check);
            validator.$dispose();

        },

        test_MultipleValidatorEventToValidate : function () {
            var data = {
                param1 : null
            };
            var multipleValidator = new aria.utils.validators.MultipleValidator(null, null, "onblur");
            var mandatoryValidator = new aria.utils.validators.Mandatory("Multiple Validator");
            multipleValidator.add({
                validator : mandatoryValidator,
                event : "onsubmit"
            });
            aria.utils.Data.setValidator(data, "param1", multipleValidator);
            var res = aria.utils.Data.validateValue(data, "param1", null, null, "onblur"); // In this test case the
            // parent validator is set
            // to validate onblur (same
            // as the triggering event),
            // but the child validator
            // is set to validate
            // onsubmit so no validation
            // should occur
            var check = (!res) ? false : true;
            this.assertFalse(check);
            aria.utils.Data.setValidatorProperties(multipleValidator.validators[0], null, "onblur");
            res = aria.utils.Data.validateValue(data, "param1", null, null, "onblur"); // In this test the child
            // validator is set to validate
            // onblur (same as parent and
            // the triggering event)
            // validation should occur.
            check = (!res) ? false : true;
            this.assertTrue(check);
            aria.utils.Data.setValidatorProperties(multipleValidator, null, "onsubmit");
            res = aria.utils.Data.validateValue(data, "param1", null, null, "onblur"); // In this test the parent
            // validator is set to validate
            // onsubmit (different from the
            // child and the triggereing
            // event) no validation should
            // occur.
            check = (!res) ? false : true;
            this.assertFalse(check);
            multipleValidator.$dispose();
            mandatoryValidator.$dispose();
        },

        test_validationWithNoEvent : function () {
            var data = {
                param1 : null,
                param2 : null
            };
            var validator = new aria.utils.validators.Mandatory(null);
            var mandatoryValidator = new aria.utils.validators.Mandatory();
            aria.utils.Data.setValidatorProperties(validator, null, "onblur");
            var multipleValidator = new aria.utils.validators.MultipleValidator(null, null, "onblur");
            multipleValidator.add({
                validator : mandatoryValidator,
                event : "onblur"
            });
            aria.utils.Data.setValidator(data, "param1", validator);
            aria.utils.Data.setValidator(data, "param2", multipleValidator);
            var res1, res2, check1, check2;
            res1 = aria.utils.Data.validateValue(data, "param1", null, null, null); // In this test a single validator
            // set to validate onblur is
            // triggered when there is no event
            // (onsubmit), validation should
            // occur.
            res2 = aria.utils.Data.validateValue(data, "param2", null, null, null); // In this case a multiple validator
            // set to validate onblur is
            // triggered when there is no event
            // (onsubmit), validation should
            // occur.
            check1 = (!res1) ? false : true;
            check2 = (!res2) ? false : true;
            this.assertTrue(check1);
            this.assertTrue(check2);
            multipleValidator.$dispose();
            validator.$dispose();
            mandatoryValidator.$dispose();

        }
    }
});
