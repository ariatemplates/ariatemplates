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
var Model = require('./Model');

module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.popup.dialog.modal.PopupDialogModalJawsTestCase',
    $extends : require('ariatemplates/jsunit/JawsTestCase'),

    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.widgets.wai.popup.dialog.modal.Tpl',
            data : Model.buildData()
        });
    },

    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var data = this.templateCtxt.data;
            var actions = [];

            function labelToJawsSay(label) {
                return label.replace(/\(/g, ' left paren ').replace(/\)/g, ' right paren ');
            }

            function processDialog(dialog) {
                if (!dialog.wai) {
                    return;
                }

                actions.push(
                    ['click', this.getElementById(dialog.elementBeforeId)],
                    ['waitForJawsToSay', 'Element before'],
                    ['type', null, '[tab]'],
                    ['waitForJawsToSay', labelToJawsSay(dialog.buttonLabel) + ' Button'],
                    ['type', null, '[enter]'],
                    ['waitForJawsToSay', labelToJawsSay(dialog.title) + ' dialog'],
                    ['waitForJawsToSay', labelToJawsSay(dialog.title) + ' heading level 1']
                );

                if (!dialog.fullyEmpty) {
                    actions.push(
                        ['type', null, '[tab]'],
                        ['waitForJawsToSay', labelToJawsSay(dialog.closeLabel) + ' Button'],
                        ['type', null, '[tab]'],
                        ['waitForJawsToSay', labelToJawsSay(dialog.maximizeLabel) + ' Button']
                    );
                }

                actions.push(
                    ['type', null, '[escape]'],
                    ['waitForJawsToSay', labelToJawsSay(dialog.buttonLabel) + ' Button']
                );
            }

            data.dialogs.forEach(processDialog.bind(this));

            this.execute(actions, {
                fn: this.end,
                scope: this
            });
        }
    }
});
