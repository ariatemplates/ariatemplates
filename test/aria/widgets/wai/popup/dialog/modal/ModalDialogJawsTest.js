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

var EnhancedRobotTestCase = require('test/EnhancedRobotTestCase');
var ariaJsunitJawsTestCase = require('ariatemplates/jsunit/JawsTestCase');

var Model = require('./Model');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.popup.dialog.modal.ModalDialogJawsTest',
    $extends : ariaJsunitJawsTestCase,

    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

        this._history = [];

        this.setTestEnv({
            template : 'test.aria.widgets.wai.popup.dialog.modal.ModalDialogTestTpl',
            data : Model.buildData()
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $prototype : {
        $init : function (prototype) {
            var source = EnhancedRobotTestCase.prototype;

            for (var key in source) {
                if (source.hasOwnProperty(key) && !prototype.hasOwnProperty(key)) {
                    prototype[key] = source[key];
                }
            }
        },



        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            this._localAsyncSequence(function (add) {
                add('_testDialogs');
                add('_checkHistory');
            }, this.end);
        },

        _checkHistory : function (callback) {
            var history = this._history;

            history = history.join('\n');

            this.assertJawsHistoryEquals(history, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _testDialogs : function (callback) {
            this._asyncIterate(
                this._getData().dialogs,
                this._testDialog,
                callback,
                this
            );
        },

        _testDialog : function (callback, dialog) {
            // ----------------------------------------------- early termination

            if (!dialog.wai) {
                callback();
                return;
            }

            // ------------------------------------------------------ processing

            this._executeStepsAndWriteHistory(callback, function (step, entry) {
                step(['click', this.getElementById(dialog.elementBeforeId)]);
                entry('Element before Link');

                step(['type', null, '[tab]']);
                entry(dialog.buttonLabel, 'Button');

                step(['type', null, '[enter]']);

                if (!dialog.fullyEmpty) {
                    entry(dialog.title, 'dialog');
                    entry(dialog.closeLabel, 'Button');

                    step(['type', null, '[tab]']);
                    entry(dialog.maximizeLabel, 'Button');
                }

                step(['type', null, '[escape]']);
                if (!dialog.fullyEmpty) {
                    entry(dialog.buttonLabel, 'Button');
                }
            });
        },



        ////////////////////////////////////////////////////////////////////////
        // Local library
        ////////////////////////////////////////////////////////////////////////

        _executeStepsAndWriteHistory : function (callback, builder, thisArg) {
            // -------------------------------------- input arguments processing

            if (thisArg === undefined) {
                thisArg = this;
            }

            // --------------------------------------------------- local globals

            var history = this._history;
            var steps = [];

            function addStep(item) {
                steps.push(item);
                steps.push(['pause', 1000]);
            }

            function addToHistory(item, role) {
                if (role != null) {
                    item += ' ' + role;
                }

                history.push(item);
            }

            // ------------------------------------------------------ processing

            builder.call(thisArg, addStep, addToHistory, steps, history);

            this.synEvent.execute(steps, {
                scope: this,
                fn: callback
            });
        }
    }
});
