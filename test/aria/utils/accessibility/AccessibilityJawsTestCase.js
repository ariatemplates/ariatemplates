/*
 * Copyright 2016 Amadeus s.a.s.
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

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');

var Accessibility = require('ariatemplates/utils/Accessibility');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.utils.accessibility.AccessibilityJawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.utils.accessibility.Tpl',
            data: {}
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            var data = this._getData();

            var regexps = [];
            regexps.push(this._createLineRegExp('AT tests.*'));

            this._filter = function (content) {
                return this._applyRegExps(regexps, content);
            };

            this._localAsyncSequence(function (add) {
                add('_test');
                add('_checkHistory');
            }, this.end);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _test : function (callback) {
            // -----------------------------------------------------------------

            function readText(text, alert) {
                return function (next) {
                    this._localAsyncSequence(function (add) {
                        add(function (next) {
                            Accessibility.readText(text, {
                                alert: alert
                            });
                            next();
                        });
                        add('_delay', 1000);
                    }, next);
                };
            }

            // -----------------------------------------------------------------

            this._history = [
                'Alert!',
                'Hello',
                'World'
            ];

            // -----------------------------------------------------------------

            this._localAsyncSequence(function (add) {
                add(readText('Hello', true));
                add(readText('World', false));
                add('_delay', 3000);
            }, callback);
        }
    }
});
