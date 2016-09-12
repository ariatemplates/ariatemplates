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
    $classpath : "test.aria.utils.validators.Mandatory",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.Mandatory"],
    $prototype : {
        test_validate : function () {
            var validator = new aria.utils.validators.Mandatory("");

            // if there is no error null is returned, otherwise the error object is returned
            var value = validator.validate("1");
            var noValue = validator.validate() === null;

            this.assertEquals(value, null);
            this.assertNotEquals(noValue, null);

            this.assertEquals(validator.validate(0), null, "0 must be considered as a non empty value");
            this.assertNotEquals(validator.validate(""), null, "An empty string must be considered as an empty value");

            validator.$dispose();
        }
    }
});
