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

var EnhancedJawsTestCase = require('test/EnhancedJawsTestCase');

var Model = require('./Model');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.TabsJawsTest',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsTestCase.constructor.call(this);

        var data = Model.buildData();
        var groups = data.groups;
        groups = [groups[2]];
        data.groups = groups;

        this.setTestEnv({
            template : 'test.aria.widgets.wai.tabs.Tpl',
            data : data
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

            var tabs = group.tabs;

            this._executeStepsAndWriteHistory(callback, function (step, entry) {
                // --------------------------------------------- local functions

                var self = this;

                function selectStartPoint() {
                    step(['click', self.getElementById(group.elementBeforeId)]);
                    entry('Element before ' + group.id + ' Link');
                }

                function getSelectedTabDescription(tab) {
                    entry(tab.label + ' Tab expanded');
                    entry('To activate tab page press Spacebar.');
                }

                function getTabDescription(tab, isSelected) {
                    entry(tab.label);

                    var description = [];
                    description.push('Tab');
                    if (tab.disabled) {
                        description.push('Unavailable');
                    }
                    if (isSelected) {
                        description.push('open', 'expanded');
                    } else {
                        description.push('closed', 'collapsed');
                    }
                    entry(description.join(' '));
                }

                function goThroughTabs(selectedTabIndex) {
                    ariaUtilsArray.forEach(tabs, function (tab, index) {
                        step(['type', null, '[down]']);
                        getTabDescription(tab, selectedTabIndex === index);
                    });
                }

                function goThroughTabpanel(selectedTab) {
                    step(['type', null, '[down]']);
                    var description = 'tab panel start';
                    if (selectedTab != null) {
                        description += ' ' + selectedTab.label;
                    }
                    entry(description);

                    step(['type', null, '[down]']);
                    entry('WaiAria activated: true');
                    step(['type', null, '[down]']);
                    step(['type', null, '[down]']);
                    entry('Edit');

                    step(['type', null, '[down]']);
                    entry('tab panel end');
                }

                // -------------------------------------------------- processing

                // no tab selected ---------------------------------------------

                selectStartPoint();
                step(['type', null, '[enter]']);

                goThroughTabs();
                goThroughTabpanel();

                // selecting one tab -------------------------------------------

                selectStartPoint();

                goThroughTabs();

                var lastTab = tabs[tabs.length - 1];
                var tabBeforeLastTab = tabs[tabs.length - 2];

                step(['type', null, '[space]']);
                getSelectedTabDescription(lastTab);

                step(['type', null, '[enter]']);
                step(['type', null, '[up]']);
                getTabDescription(tabBeforeLastTab);
                step(['type', null, '[down]']);
                getTabDescription(lastTab, true);

                goThroughTabpanel(lastTab);
            });
        }
    }
});
