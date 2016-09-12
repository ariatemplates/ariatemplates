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
 * Test suite for validators
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.validators.ValidatorsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.utils.validators.AlphaTestCase");
        this.addTests("test.aria.utils.validators.AlphaInternationalTestCase");
        this.addTests("test.aria.utils.validators.AlphaNumTestCase");
        this.addTests("test.aria.utils.validators.AlphaNumInternationalTestCase");
        this.addTests("test.aria.utils.validators.EmailTestCase");
        this.addTests("test.aria.utils.validators.MandatoryTestCase");
        this.addTests("test.aria.utils.validators.MinMaxLengthTestCase");
        this.addTests("test.aria.utils.validators.MultipleValidatorTestCase");
        this.addTests("test.aria.utils.validators.NumberTestCase");
        this.addTests("test.aria.utils.validators.ObjectTestCase");
        this.addTests("test.aria.utils.validators.PhoneTestCase");
        this.addTests("test.aria.utils.validators.StringTestCase");
        this.addTests("test.aria.utils.validators.ValidatorTestCase");
    }
});
