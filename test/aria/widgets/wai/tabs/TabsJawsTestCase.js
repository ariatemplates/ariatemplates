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

var ariaUtilsAlgo = require('ariatemplates/utils/Algo');
var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsFunction = require('ariatemplates/utils/Function');

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');

var Model = require('./Model');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.TabsJawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        var data = Model.buildData();
        var groups = data.groups;
        groups = [groups[2]];
        data.groups = groups;

        this.setTestEnv({
            template : 'test.aria.widgets.wai.tabs.Tpl',
            data : data
        });

        this.expectedOutput = [
            // simple traversal with no selection ------------------------------

            // Tab 0
            'Link collapsed Tab 0',

            // Tab 1
            'Link Unavailable collapsed Tab 1',

            // Tab 2
            'Link collapsed Tab 2',

            // TabPanel
            'tab panel start',
            'WaiAria activated: true',
            'Edit',
            'tab panel end',

            // selecting last Tab ----------------------------------------------

            // Tab 0
            'Link collapsed Tab 0',

            // Tab 1
            'Link Unavailable collapsed Tab 1',

            // Tab 2
            'Link collapsed Tab 2',
            // glitch: since the focus is immediately moved (see next comment), the state of the Tab can not be read

            // selecting a Tab means focusing the first element inside the TabPanel
            'Tab 2',

            // simple traversal with a Tab selected ----------------------------

            // Tab 0
            'Link collapsed Tab 0',

            // Tab 1
            'Link Unavailable collapsed Tab 1',

            // Tab 2
            'Link expanded Tab 2',

            // TabPanel: now the title of the controlling Tab is read
            'tab panel start Tab 2',
            'Tab 2',
            'WaiAria activated: true',
            'Edit',
            'tab panel end'
        ].join('\n');
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
            regexps.push(this._createLineRegExp('Element before .*'));
            regexps.push(this._createLineRegExp('separator'));
            regexps.push(this._createLineRegExp('AT test*'));

            this._filter = ariaUtilsFunction.bind(this._applyRegExps, this, regexps);

            this._localAsyncSequence(function (add) {
                add('_testGroups');
                add('_checkHistory');
            }, this.end);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _testGroups : function (callback) {
            var groups = this._getData().groups;

            this._asyncIterate(
                groups,
                this._testGroup,
                callback,
                this
            );
        },

        _testGroup : function (callback, group) {
            if (!group.waiAria || group.tabsUnder) {
                callback();
                return;
            }

            var expectedOutput = this.expectedOutput;

            var tabs = group.tabs;
            var elementBefore = this.getElementById(group.elementBeforeId);

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;

                var space = api.space;
                var down = api.down;

                // --------------------------------------------- local functions

                function selectStartPoint() {
                    step(['click', elementBefore]);
                }

                function goThroughTabs(selectedTabIndex) {
                    ariaUtilsArray.forEach(tabs, down);
                }

                function goThroughTabpanel() {
                    ariaUtilsAlgo.times(7, down);
                }

                // -------------------------------------------------- processing

                // no tab selected ---------------------------------------------

                selectStartPoint();

                goThroughTabs();
                goThroughTabpanel();

                // selecting one tab -------------------------------------------

                selectStartPoint();
                goThroughTabs();
                space();

                selectStartPoint();
                goThroughTabs();
                goThroughTabpanel();

                // -------------------------------------------------------------

                says(expectedOutput);
            });
        }
    }
});
