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
var ariaUtilsString = require('ariatemplates/utils/String');
var subst = ariaUtilsString.substitute;

var Model = require('./Model');



////////////////////////////////////////////////////////////////////////////////
// Model: Test
////////////////////////////////////////////////////////////////////////////////

module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.RobotBase',
    $extends : require('test/EnhancedRobotBase'),

    $constructor : function () {
        // ------------------------------------------------------ initialization

        this.$EnhancedRobotBase.constructor.call(this);

        // ---------------------------------------------------------- processing

        var data = Model.buildData();
        data.readBinding = this._readBinding;

        var groupIndex = this.groupIndex;
        if (groupIndex != null) {
            var groups = data.groups;
            groups = [groups[groupIndex]];
            data.groups = groups;
        }

        this.setTestEnv({
            template : 'test.aria.widgets.wai.tabs.Tpl',
            data: data
        });
    },

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Tests: global
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            this._localAsyncSequence(function (add) {
                add('_testNavigation');
            }, this.end);
        },

        _runTestOnGroups : function (callback, test) {
            var groups = this._getData().groups;

            this._asyncIterate(groups, test, callback, this);
        },



        ////////////////////////////////////////////////////////////////////////
        // Tests: navigation
        ////////////////////////////////////////////////////////////////////////

        _testNavigation : function (callback) {
            this._localAsyncSequence(function (add) {
                add('_testTabNavigation');
                add('_testKeyboardSelection');
            }, callback);
        },

        _testTabNavigation : function (callback) {
            this._runTestOnGroups(callback, this._testTabNavigationForGroup);
        },

        _testKeyboardSelection : function (callback) {
            this._runTestOnGroups(callback, this._testKeyboardSelectionForGroup);
        },

        _testTabNavigationForGroup : function (callback, group) {
            // --------------------------------------------------- destructuring

            var tabsUnder = group.tabsUnder;
            var tabPanelId = group.tabPanel.id;
            var tabs = group.tabs;

            // ------------------------------------------------------ processing

            function checkTabPanel(add) {
                add('_pressTab');
                add('_checkWidgetIsFocused', tabPanelId);

                add('_pressTab');
                add('_checkElementIsFocused', 'inside_' + tabPanelId);
            }

            function checkTabs(add) {
                ariaUtilsArray.forEach(tabs, function (tab) {
                    if (tab.disabled) {
                        return;
                    }

                    add('_pressTab');
                    add('_checkWidgetIsFocused', tab.tabId);
                });
            }

            this._localAsyncSequence(function (add) {
                add('_focusElementBefore', group.id);

                if (tabsUnder) {
                    checkTabPanel(add);
                    checkTabs(add);
                } else {
                    checkTabs(add);
                    checkTabPanel(add);
                }
            }, callback);
        },

        _testKeyboardSelectionForGroup : function (callback, group) {
            // --------------------------------------------------- destructuring

            var tabs = group.tabs;
            var tabPanelId = group.tabPanel.id;

            // ------------------------------------------------------ processing

            var isNoTabSelected = this._createTabSelectedPredicate(group, null);

            this._localAsyncSequence(function (add) {
                add('_focusFirstTab', group);
                add(isNoTabSelected.waitForTrue);

                ariaUtilsArray.forEach(tabs, function (tab, index) {
                    // --------------------------------------- early termination

                    if (tab.disabled) {
                        return;
                    }

                    // ---------------------------------------------- processing

                    add('_focusElementBefore', group.id);

                    if (group.tabsUnder) {
                        add('_navigateForward');
                        add('_navigateForward');
                    }

                    ariaUtilsArray.forEach(tabs.slice(0, index + 1), function (tab) {
                        if (!tab.disabled) {
                            add('_navigateForward');
                        }
                    });


                    var selectionMethod = index === 0 ? '_pressEnter' : '_pressSpace';
                    add(selectionMethod);

                    var predicate = this._createTabSelectedPredicate(group, tab);
                    add(predicate.waitForTrue);

                    if (tab.waiAria) {
                        add('_checkWidgetIsFocused', tabPanelId);
                        // Specifications often change (2016-07-22T16:54:42+02:00), what should precisely be focused might change
                        // add('_checkElementIsFocused', 'inside_' + tabPanelId);
                    }
                }, this);
            }, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        // Local library
        ////////////////////////////////////////////////////////////////////////

        _createTabSelectedPredicate : function (group, tab) {
            var id = (tab != null) ? tab.tabId : null;

            return this._createPredicate(function () {
                var selectedTab = this._readBinding(group.binding);

                var result;

                if (id == null) {
                    result = selectedTab == null;
                } else {
                    result = selectedTab === id;
                }

                return result;
            }, function (shouldBeTrue, args) {
                var selectedTab = this._readBinding(group.binding);

                var message;
                if (id == null) {
                    message = 'No tab should be selected, instead "%1" is.';
                } else {
                    message = 'The wrong tab is selected: "%1" instead of "%2".';
                }

                return subst(message, selectedTab, id);
            });
        },

        _focusFirstTab : function (callback, group) {
            this._localAsyncSequence(function (add) {
                add('_focusElementBefore', group.id);
                add('_navigateForward'); // from anchor to following element
                if (group.tabsUnder) {
                    add('_navigateForward'); // from panel to element inside
                    add('_navigateForward'); // from element to first tab
                }
                add('_waitForWidgetFocus', group.tabs[0].tabId);
            }, callback);
        }
    }
});
