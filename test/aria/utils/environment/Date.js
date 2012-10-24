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
 * Test case for aria.utils.environment.Date
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.environment.Date",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.environment.Date", "aria.utils.environment.Date"],
    $prototype : {
        /**
         * Test setters and getters.
         */
        testSetGetDateFormats : function () {
            aria.core.AppEnvironment.setEnvironment({
                "dateFormats" : {
                    "dateBeforeMonth" : false
                }
            });
            // test user defined application settings.
            this.assertFalse(aria.utils.environment.Date.getDateFormats().dateBeforeMonth);
            aria.core.AppEnvironment.setEnvironment({});
            // test application settings reset with default values.
            this.assertTrue(aria.utils.environment.Date.getDateFormats().dateBeforeMonth);
        },
        /**
         * Test setters and getters.
         */
        testSetGetTimeFormats : function () {
            aria.core.AppEnvironment.setEnvironment({
                "timeFormats" : {
                    "shortFormat" : "hh"
                }
            });
            // test user defined application settings.
            this.assertTrue(aria.utils.environment.Date.getTimeFormats().shortFormat === "hh");

            aria.core.AppEnvironment.setEnvironment({});
            // test application settings reset with default values.
            this.assertTrue(aria.utils.environment.Date.getTimeFormats().shortFormat === "HH:mm");

        },

        /**
         * Test setters and getters.
         */
        testSetGetFirstDayOfWeek : function () {
            aria.core.AppEnvironment.setEnvironment({
                "firstDayOfWeek" : 1
            });
            // test user defined application settings.
            this.assertTrue(aria.utils.environment.Date.getFirstDayOfWeek() === 1);

            aria.core.AppEnvironment.setEnvironment({});
            // test application settings reset with default values.
            this.assertTrue(aria.utils.environment.Date.getFirstDayOfWeek() === 0);

        }
    }
});