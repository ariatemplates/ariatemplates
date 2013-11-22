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
 * Test case for aria.utils.DatePatternInterpret
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.DatePatternInterpret",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Date"],
    $prototype : {
        testInputPattern : function () {
            var today = new Date();
            var expectedDate = new Date(2012, 2, 10);
            var expectedDateCurrentYear = new Date(today.getFullYear(), 2, 10);

            // one string pattern
            var inputPattern1 = "yyyy-MM-dd";
            var date1options = {
                inputPattern : inputPattern1
            };
            this.interpretInputPatternAndAssert("2012-03-10", date1options, expectedDate);
            // function pattern
            var userDefinedParser = function (dateStr) {
                if (dateStr === "today") {
                    return new Date();
                } else
                    return null;

            };
            var date2options = {
                inputPattern : userDefinedParser
            };

            this.interpretInputPatternAndAssert("today", date2options, today);
            // array of patterns
            var inputPattern3 = ["yyyy-I-dd", "yyyy:dd MMM", userDefinedParser, "yyyy*dd;MM", "yy-I", "d/yy.M", "I-dd",
                    "MMM.yyyy", "dKMM"];
            var date3options = {
                inputPattern : inputPattern3

            };
            this.interpretInputPatternAndAssert("2012-MAR-10", date3options, expectedDate);
            this.interpretInputPatternAndAssert("2012:10 Mar", date3options, expectedDate);
            this.interpretInputPatternAndAssert("today", date3options, today);
            this.interpretInputPatternAndAssert("2012*10;03", date3options, expectedDate);
            this.interpretInputPatternAndAssert("12-juL", date3options, new Date(2012, 6, 1));
            this.interpretInputPatternAndAssert("9/12.7", date3options, new Date(2012, 6, 9));
            this.interpretInputPatternAndAssert("mar-10", date3options, expectedDateCurrentYear);
            this.interpretInputPatternAndAssert("jul.2012", date3options, new Date(2012, 6, 1));
            this.interpretInputPatternAndAssert("9K07", date3options, new Date(today.getFullYear(), 6, 9));
        },

        interpretInputPatternAndAssert : function (dateStr, dateOptions, expectedDate) {
            var interpretedDate = aria.utils.Date.interpret(dateStr, dateOptions);
            this.assertEquals(interpretedDate.getDate(), expectedDate.getDate());
            this.assertEquals(interpretedDate.getMonth(), expectedDate.getMonth());
            this.assertEquals(interpretedDate.getFullYear(), expectedDate.getFullYear());
        }
    }
});
