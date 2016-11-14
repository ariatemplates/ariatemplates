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

var ariaUtilsArray = require('ariatemplates/utils/Array');

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.datePicker.readDate.DatePickerReadDateJawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        this.confirmDateDelay = 500;

        this.setTestEnv({
            template : 'test.aria.widgets.wai.datePicker.readDate.Tpl',
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
            var regexps = [];
            regexps.push(this._createLineRegExp('AT tests.*'));
            regexps.push(this._createLineRegExp('focus me'));
            regexps.push(this._createLineRegExp('focus me Edit'));
            regexps.push(/^\n/gi);

            this._filter = function (content) {
                content = content.replace(/\s*\n/gi, '\n');
                content = this._applyRegExps(regexps, content);
                return content;
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
            // --------------------------------------------------- destructuring

            var document = Aria.$window.document;
            var confirmDateDelay = this.confirmDateDelay;
            var elements = this._getData().elements;

            // ------------------------------------------------------ processing

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;
                var delay = api.delay;
                var key = api.key;
                var specialKey = api.specialKey;

                var down = api.down;
                var enter = api.enter;
                var right = api.right;

                // --------------------------------------------- local functions

                function selectStartPoint() {
                    step(['click', document.getElementById(elements.before.id)]);
                    // read text is filtered
                }

                // -------------------------------------------------- processing

                api.defaultDelay = confirmDateDelay * 2;

                // -------------------------------------------------------------
                // Navigating to the DatePicker's calendar button

                selectStartPoint();

                down();
                says('calendar one label');
                down();
                says('Edit 6/9/16');
                down();
                says('calendar one button', 'button menu collapsed');

                // -------------------------------------------------------------
                // Opening calendar and selecting the next date

                enter();
                says('calendar one');
                says('6 September 2016');

                right();
                says('7 September 2016');

                // -------------------------------------------------------------
                // Typing enter to validate

                enter();
                delay(7000);
                says('calendar one label Edit');
                says('7/9/16', 'Type in text.'); // input content is read
                says('Wednesday 7 September 2016'); // date is read

                // -------------------------------------------------------------
                // Inputting date "by hand"

                key('[backspace]5');
                says('6'); // says removed letter, but not the one typed in
                says('Monday 7 September 2015'); // date is read

                // -------------------------------------------------------------
                // Checking that keystrokes not changing text don't trigger a read

                specialKey('left');
                says('5');
            });
        }
    }
});
