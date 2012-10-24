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
 * Multiple validator unit test
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.validators.MultipleValidator",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.MultipleValidator", "aria.utils.validators.Number",
            "aria.utils.validators.Alpha", "aria.utils.Data"],
    $prototype : {
        /**
         * Test the validate function
         */
        test_validate : function () {
            var alphaValidator = new aria.utils.validators.Alpha('Alpha');
            var numberValidator = new aria.utils.validators.Number('Number');
            var multipleValidator = new aria.utils.validators.MultipleValidator();
            multipleValidator.add(numberValidator, alphaValidator);

            var messages = multipleValidator.validate({});
            this.assertTrue(messages.length == 2, "There should be 2 errors reported.");

            multipleValidator.breakOnMessage = true;
            messages = multipleValidator.validate({});
            this.assertTrue(messages.length == 1, "There should be 1 error reported only.");

            multipleValidator.remove(alphaValidator);
            messages = multipleValidator.validate(3);
            this.assertTrue(messages == null, "There should be no error reported.");

            // test with grouping
            multipleValidator.$dispose();

            multipleValidator = new aria.utils.validators.MultipleValidator('TEST_MESSAGE');
            multipleValidator.add(numberValidator, alphaValidator);
            multipleValidator.breakOnMessage = false;
            messages = multipleValidator.validate({});
            this.assertTrue(messages.length == 1, "There should be 1 error reported only.");
            this.assertTrue(messages[0].localizedMessage == 'TEST_MESSAGE', "Message should be the message defined in the validator");

            multipleValidator.$dispose();
            alphaValidator.$dispose();
            numberValidator.$dispose();

        }
    }
});