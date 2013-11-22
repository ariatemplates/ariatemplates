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

        this.addTests("test.aria.utils.validators.Alpha");
        this.addTests("test.aria.utils.validators.AlphaInternational");
        this.addTests("test.aria.utils.validators.AlphaNum");
        this.addTests("test.aria.utils.validators.Email");
        this.addTests("test.aria.utils.validators.Mandatory");
        this.addTests("test.aria.utils.validators.MinMaxLength");
        this.addTests("test.aria.utils.validators.MultipleValidator");
        this.addTests("test.aria.utils.validators.Number");
        this.addTests("test.aria.utils.validators.Object");
        this.addTests("test.aria.utils.validators.Phone");
        this.addTests("test.aria.utils.validators.String");
        this.addTests("test.aria.utils.validators.Validator");
    }
});
