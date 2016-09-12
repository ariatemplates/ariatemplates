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

var Model = require('./Model');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.popup.dialog.modal.PopupDialogModalJawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.widgets.wai.popup.dialog.modal.Tpl',
            data : Model.buildData()
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
            this._localAsyncSequence(function (add) {
                add('_testDialogs');
                add('_checkHistory');
            }, this.end);
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

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;

                var tab = api.tab;
                var enter = api.enter;
                var escape = api.escape;

                // -------------------------------------------------- processing

                step(['click', this.getElementById(dialog.elementBeforeId)]);
                says('Element before');

                tab();
                says(dialog.buttonLabel + ' Button');

                enter();

                says(dialog.title + ' dialog');
                says(dialog.title + ' heading level 1');

                if (!dialog.fullyEmpty) {
                    tab();
                    says(dialog.closeLabel + ' Button');

                    tab();
                    says(dialog.maximizeLabel + ' Button');
                }

                escape();

                says(dialog.buttonLabel + ' Button');
            });
        }
    }
});
