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
 * Test cases for aria.utils.validators.Object
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.validators.Object",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.Object"],
    $prototype : {
        /**
         * Test the validate function with different use cases
         */
        test_validate : function () {
            var objectValidator = new aria.utils.validators.Object();
            this.assertTrue(objectValidator.validate({}) == null, "{} is a valid object");
            this.assertFalse(objectValidator.validate(new String()) == null, "{} is a valid object");
            this.assertFalse(objectValidator.validate("") == null, "{} is a valid object");

            // null is valid, to allow this validator to be used with the mandatory validator
            this.assertTrue(objectValidator.validate(null) == null, "{} is a valid object");
            objectValidator.$dispose();
        }
    }
});
