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
 * Test cases for generic aria.utils.validators.Validator
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.validators.ValidatorTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.Validator", "aria.utils.validators.Mandatory", "aria.utils.validators.Alpha"],
    $prototype : {
        /**
         * Test case to test custom messages
         */
        test_messageOverriding : function () {

            // static overriding
            this.checkAndDispose(new aria.utils.validators.Mandatory(), aria.utils.validators.Mandatory.DEFAULT_LOCALIZED_MESSAGE);

            // string overriding
            this.checkAndDispose(new aria.utils.validators.Mandatory("test"), "test");

            // object overriding
            this.checkAndDispose(new aria.utils.validators.Mandatory({
                errorMessage : "test2"
            }), "test2");

        },

        /**
         * Test case to test custom messages with global environment settings
         */
        test_messageOverridingWithGlobal : function () {

            var firstMsg = "first error msg";
            var secondMsg = "second error msg";
            aria.core.AppEnvironment.setEnvironment({
                validatorMessages : {
                    AlphaNum : firstMsg,
                    Mandatory : firstMsg,
                    Email : secondMsg
                }
            });

            // static overriding
            this.checkAndDispose(new aria.utils.validators.Alpha(), aria.utils.validators.Alpha.DEFAULT_LOCALIZED_MESSAGE, 33);

            // string overriding
            this.checkAndDispose(new aria.utils.validators.Mandatory("test"), "test");

            // environment overriding
            this.checkAndDispose(new aria.utils.validators.Mandatory(), firstMsg);

        },

        checkAndDispose : function (validator, message, toBeValidated) {
            this.assertTrue(validator.validate(toBeValidated)[0].errorMessage == message);
            validator.$dispose();
        }

    }
});
