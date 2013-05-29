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
    $classpath : "test.aria.utils.validators.Validator",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.Validator", "aria.utils.validators.Mandatory"],
    $prototype : {
        /**
         * Test case to test custom messages
         */
        test_messageOverriding : function () {

            // static overriding
            var validator = new aria.utils.validators.Mandatory();
            this.assertTrue(validator.validate()[0].errorMessage == "This field is a mandatory field.");
            validator.$dispose();

            // string overriding
            validator = new aria.utils.validators.Mandatory("test");
            this.assertTrue(validator.validate()[0].errorMessage == "test");
            validator.$dispose();

            // object overriding
            validator = new aria.utils.validators.Mandatory({
                errorMessage : "test2"
            });
            this.assertTrue(validator.validate()[0].errorMessage == "test2");
            validator.$dispose();

        }
    }
});
