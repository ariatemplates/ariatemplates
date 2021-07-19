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
    $classpath : 'test.aria.widgets.wai.tabs.TabsJawsTestCase',
    $extends : require('ariatemplates/jsunit/JawsTestCase'),

    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

        var data = Model.buildData();
        var groups = data.groups;
        groups = [groups[2]];
        data.groups = groups;

        this.setTestEnv({
            template : 'test.aria.widgets.wai.tabs.Tpl',
            data : data
        });
    },

    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var group = this.templateCtxt.data.groups[0];
            var elementBefore = this.getElementById(group.elementBeforeId);

            this.execute([
                // no tab selected
                ['click', elementBefore],
                ['waitFocus', elementBefore],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Tab 0'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link Unavailable collapsed Tab 1'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Tab 2'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Wai Aria activated colon true'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'my input'],

                // selecting one tab
                ['click', elementBefore],
                ['waitFocus', elementBefore],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Tab 0'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link Unavailable collapsed Tab 1'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Tab 2'],
                ['type', null, '[space]'],
                // glitch: since the focus is immediately moved (see next comment), the state of the Tab can not be read
                ['type', null, '[space]'],
                // selecting a Tab means focusing the first element inside the TabPanel
                ['waitForJawsToSay', 'Tab 2'],

                // simple traversal with a Tab selected
                ['click', elementBefore],
                ['waitFocus', elementBefore],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Tab 0'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link Unavailable collapsed Tab 1'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link expanded Tab 2'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Tab 2'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Wai Aria activated colon true'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'my input']

            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
