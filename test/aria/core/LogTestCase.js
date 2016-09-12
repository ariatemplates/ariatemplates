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
 * Test case for the logger
 */
Aria.classDefinition({
    $classpath : "test.aria.core.LogTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.Log"],
    $prototype : {
        /**
         * Test that valid log levels are indeed known as valid by the logger
         */
        testValidLevels : function () {
            this.assertTrue(aria.core.Log.isValidLevel(aria.core.Log.LEVEL_DEBUG));
            this.assertTrue(aria.core.Log.isValidLevel(aria.core.Log.LEVEL_INFO));
            this.assertTrue(aria.core.Log.isValidLevel(aria.core.Log.LEVEL_WARN));
            this.assertTrue(aria.core.Log.isValidLevel(aria.core.Log.LEVEL_ERROR));
        },

        testNewAppender : function () {
            Aria["classDefinition"]({
                $classpath : "test.my.own.log.Appender",
                $constructor : function () {
                    this.logs = [];
                },
                $prototype : {
                    debug : function () {
                        this.logs.push({
                            level : "debug",
                            args : arguments
                        });
                    },
                    info : function () {
                        this.logs.push({
                            level : "info",
                            args : arguments
                        });
                    },
                    warn : function () {
                        this.logs.push({
                            level : "warn",
                            args : arguments
                        });
                    },
                    error : function () {
                        this.logs.push({
                            level : "error",
                            args : arguments
                        });
                    }
                }
            });

            var logger = aria.core.Log;

            logger.addAppender(new test.my.own.log.Appender());

            this.$logDebug("1");
            this.$logInfo("2");
            this.$logWarn("3");
            this.$logError("4");

            var app = logger.getAppenders("test.my.own.log.Appender")[0];
            this.assertTrue(app.logs.length == 4);
            this.assertTrue(app.logs[1].level == "info");
            this.assertTrue(app.logs[3].level == "error");

            // removing the fake appender with the removeAppenders method
            aria.core.Log.removeAppender(app);
            this.assertUndefined(logger.getAppenders("test.my.own.log.Appender")[0]);

            // clean up appenders so as not to compromise the rest of the test suite
            aria.core.Log.clearAppenders();
            aria.core.Log.addAppender(new aria.core.log.SilentArrayAppender());
        }
    }
});
