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
 * Test case for aria.utils.Date.compare method
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.DateCompare",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Date"],
    $prototype : {

        /**
         * compare dates by taking time into account
         * @public
         */
        testCompareWithTime : function () {

            var dateUtil = aria.utils.Date;

            var date1 = new Date(2010, 3, 1, 11, 33, 1);
            var date2 = new Date(2010, 3, 1, 11, 33, 2);
            var date3 = new Date(2010, 3, 2, 11, 33, 1);
            var date4 = new Date(2010, 3, 1, 11, 33, 1);

            this.assertEquals(dateUtil.compare(date1, date2, true), -1, "Wrong result for comparison with time");
            this.assertEquals(dateUtil.compare(date3, date1, true), 1, "Wrong result for comparison with time");
            this.assertEquals(dateUtil.compare(date4, date1, true), 0, "Wrong result for comparison with time when dates are equal");

        },

        /**
         * compare dates by ignoring time
         * @public
         */
        testCompareWithoutTime : function () {

            var dateUtil = aria.utils.Date;

            var date1 = new Date(2010, 3, 1, 11, 33, 1);
            var date2 = new Date(2010, 3, 1, 11, 33, 2);
            var date3 = new Date(2010, 3, 2, 11, 33, 1);
            var date4 = new Date(2010, 3, 1, 11, 33, 1);

            this.assertEquals(dateUtil.compare(date1, date2, false), 0, "Wrong result for comparison without time");
            this.assertEquals(dateUtil.compare(date3, date1, false), 1, "Wrong result for comparison without time");
            this.assertEquals(dateUtil.compare(date1, date3, false), -1, "Wrong result for comparison without time");
            this.assertEquals(dateUtil.compare(date4, date1, false), 0, "Wrong result for comparison without time when dates are equal");

            // Check that the third argument defaults to false
            this.assertEquals(dateUtil.compare(date1, date2), 0, "Wrong result for comparison without time");
            this.assertEquals(dateUtil.compare(date3, date1), 1, "Wrong result for comparison without time");
            this.assertEquals(dateUtil.compare(date1, date3), -1, "Wrong result for comparison without time");
            this.assertEquals(dateUtil.compare(date4, date1), 0, "Wrong result for comparison without time when dates are equal");

        }
    }
});
