/*
 * Copyright 2017 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');

var TemplateTestCase = require('ariatemplates/jsunit/TemplateTestCase');



module.exports = Aria.classDefinition({
    $classpath: 'test.aria.jsunit.templateTests.TemplateTestCaseTemplateExtraOptionsTestCase',
    $extends: TemplateTestCase,

    $constructor: function () {
        this.$TemplateTestCase.$constructor.apply(this, arguments);

        var mainMacroArg = 'This is the arg passed to the main macro';
        this.mainMacroArg = mainMacroArg;

        var data = {
            property: 'this is kept'
        };
        this.data = data;

        var ignoredData = {
            property: 'this is ignored'
        };
        this.ignoredData = ignoredData;

        this.setTestEnv({
            data: data,
            templateLoadingExtraOptions: {
                data: ignoredData,
                args: [mainMacroArg]
            }
        });
    },

    $prototype: {
        runTemplateTest: function () {
            var actualData = this.templateCtxt.data;
            var expectedData = this.data;
            this.assertTrue(actualData.property === expectedData.property, 'Options in templateLoadingExtraOptions should not replace the ones from the test environment.');

            var actualInitArgs = actualData.mainMacroArg;
            var expectedInitArgs = this.mainMacroArg;
            this.assertTrue(actualInitArgs === expectedInitArgs, 'mainMacroArg should have been passed to the template loading through the options templateLoadingExtraOptions.');

            this.end();
        }
    }
});
