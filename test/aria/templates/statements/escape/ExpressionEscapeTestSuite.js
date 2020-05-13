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
 * Test suite regrouping all tests of the core namespace
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.statements.escape.ExpressionEscapeTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.templates.statements.escape.ExpressionEscapeTest");
        this.addTests("test.aria.templates.statements.escape.ExpressionEscapeEnvironmentTest");

        this.addTests("test.aria.templates.statements.escape.templateOverride.AutoEscapeDefaultFalseTestCase");
        this.addTests("test.aria.templates.statements.escape.templateOverride.AutoEscapeDefaultTrueTestCase");
        this.addTests("test.aria.templates.statements.escape.templateOverride.AutoEscapeFalseFalseTestCase");
        this.addTests("test.aria.templates.statements.escape.templateOverride.AutoEscapeFalseTrueTestCase");
        this.addTests("test.aria.templates.statements.escape.templateOverride.AutoEscapeTrueFalseTestCase");
        this.addTests("test.aria.templates.statements.escape.templateOverride.AutoEscapeTrueTrueTestCase");

        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride1TestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride1RevTestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride2TestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride2RevTestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride3TestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride3RevTestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride4TestCase");
        this.addTests("test.aria.templates.statements.escape.packageOverride.PackageOverride4RevTestCase");
    }
});
