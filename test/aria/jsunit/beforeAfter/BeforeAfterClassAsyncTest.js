/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Check that `beforeClass` and `afterClass` work as supposed when defined in asynchronous manner.<br>
 * <br>
 * The method `test1` is overridden instead of having a new test method created, because when overriding the methods,
 * the test runner sees all the parent class' test* methods, while when adding new test* methods here, the parent ones
 * are discarded. Also, this way we reuse the certain assertions from the parent class regarding the number and order of
 * events pushed to `this.events`.
 */
Aria.classDefinition({
    $classpath : "test.aria.jsunit.beforeAfter.BeforeAfterClassAsyncTest",
    $extends : "test.aria.jsunit.beforeAfter.AbstractBeforeAfterTest",
    $prototype : {
        beforeClass : function (done) {
            this.events.push("beforeClass");

            var url = aria.core.DownloadMgr.resolveURL("test/aria/jsunit/beforeAfter/testJson.json");
            aria.core.IO.asyncRequest({
                url : url,
                expectedResponseType : "json",
                callback : {
                    fn : function (res) {
                        this.responseJSON = res.responseJSON;
                        this.$callback(done);
                    },
                    scope : this
                }
            });
        },

        afterClass : function (done) {
            this.events.push("afterClass");
            this.$callback(done);
        },

        /**
         * @override
         */
        test1 : function () {
            // test that JSON was properly loaded in `beforeClass`
            this.events.push("test1");
            this.assertJsonEquals(this.responseJSON, {
                foo : "FOO",
                bar : "BAR"
            });
        }
    }
});
