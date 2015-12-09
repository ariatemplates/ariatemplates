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

var Model = require('./Model');



////////////////////////////////////////////////////////////////////////////////
// Model: Test
////////////////////////////////////////////////////////////////////////////////

module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.Base',
    $extends : require('test/EnhancedRobotTestCase'),

    $constructor : function () {
        // ------------------------------------------------------ initialization

        this.$EnhancedRobotTestCase.constructor.call(this);

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
                add('_testAttributes');
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
            var tabs = group.tabs;

            var isNoTabSelected = this._createTabSelectedPredicate(group, null);

            this._localAsyncSequence(function (add) {
                add('_focusFirstTab', group);
                add(isNoTabSelected.waitForTrue);

                ariaUtilsArray.forEach(tabs, function (tab, index) {
                    if (tab.disabled) {
                        return;
                    }

                    var selectionMethod = index === 0 ? '_pressEnter' : '_pressSpace';
                    add(selectionMethod);

                    var predicate = this._createTabSelectedPredicate(group, tab);
                    add(predicate.waitForTrue);

                    if (index !== tabs.length - 1) {
                        add('_navigateForward');
                    }
                }, this);
            }, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        // Tests: attributes
        ////////////////////////////////////////////////////////////////////////

        _testAttributes : function (callback) {
            this._localAsyncSequence(function (add) {
                add('_testStaticAttributes');
                add('_testDynamicAttributes');
            }, callback);
        },

        _testStaticAttributes : function (callback) {
            this._runTestOnGroups(callback, this._testStaticAttributesForGroup);
        },

        _testDynamicAttributes : function (callback) {
            this._runTestOnGroups(callback, this._testDynamicAttributesForGroup);
        },

        _testStaticAttributesForGroup : function (callback, group) {
            var tabs = group.tabs;
            var tabPanel = group.tabPanel;

            this._localAsyncSequence(function (add) {
                add(this._createAsyncWrapper(function checkRoles() {
                    ariaUtilsArray.forEach(tabs, this._checkTabRole, this);
                    ariaUtilsArray.forEach(tabs, this._checkTabDisabled, this);
                    this._checkTabPanelRole(tabPanel);
                }));
            }, callback);
        },

        _checkTabRole : function (tab) {
            var expected = tab.waiAria ? 'tab' : null;
            this._checkWidgetRole(tab.tabId, expected);
        },

        _checkTabDisabled : function (tab) {
            var expected;
            if (!tab.waiAria) {
                expected = null;
            } else {
                expected = tab.disabled ? 'true' : 'false';
            }
            this._checkWidgetAttribute(tab.tabId, 'aria-disabled', expected);
        },

        _checkTabPanelRole : function (tabPanel) {
            var expected = tabPanel.waiAria ? 'tabpanel' : null;
            this._checkWidgetRole(tabPanel.id, expected);
        },

        _checkWidgetRole : function (id, expected) {
            this._checkWidgetAttribute(id, 'role', expected);
        },

        _testDynamicAttributesForGroup : function (callback, group) {
            var tabs = group.tabs;

            this._localAsyncSequence(function (add) {
                add(unSelectTab, group);
                add('_testDynamicAttributesForGroupWhenNoTabSelected', group);

                add('_focusFirstTab', group);

                ariaUtilsArray.forEach(tabs, function (tab, tabIndex) {
                    if (tab.disabled) {
                        return;
                    }

                    add(selectTab, tab);
                    add('_testDynamicAttributesForGroupWhenTabSelected', group, tabIndex);

                    if (tabIndex !== tabs.length - 1) {
                        add('_navigateForward');
                    }
                });
            }, callback);

            function unSelectTab(callback, group) {
                this._setBindingValue(group.binding, null);
                callback();
            }

            function selectTab(next, tab) {
                this._localAsyncSequence(function (add) {
                    add('_pressEnter');
                    add('_waitForWidgetFocus', tab.tabId);
                }, next);
            }
        },

        _testDynamicAttributesForGroupWhenNoTabSelected : function (callback, group) {
            // --------------------------------------------------- destructuring

            var tabs = group.tabs;
            var tabPanel = group.tabPanel;

            var tabPanelId = tabPanel.id;

            // ------------------------------------------------------ processing

            this._checkWidgetAttribute(tabPanelId, 'aria-labelledby', null);

            ariaUtilsArray.forEach(tabs, function (tab) {
                var tabId = tab.tabId;

                var expected;
                if (tab.waiAria && tabPanel.waiAria) {
                    expected = this._getWidgetId(tabPanelId);
                } else {
                    expected = null;
                }

                this._checkWidgetAttribute(tabId, 'aria-selected', tab.waiAria ? 'false' : null);
                this._checkWidgetAttribute(tabId, 'aria-expanded', tab.waiAria ? 'false' : null);

                this._checkWidgetAttribute(tabId, 'aria-controls', expected); // This is not dependent on the selection, so this check is not repeated inside the cases when a tab is selected
            }, this);

            // ---------------------------------------------------------- return

            callback();
        },

        _testDynamicAttributesForGroupWhenTabSelected : function (callback, group, tabIndex) {
            // --------------------------------------------------- destructuring

            var waiAria = group.waiAria;

            var tabs = group.tabs;
            var selectedTab = tabs[tabIndex];

            // ----------------------------------------------- early termination

            if (selectedTab.disabled) {
                callback();
                return;
            }

            // ------------------------------------------------------ processing

            var nonSelectedTab = tabs[tabIndex === 0 ? 2 : 0];

            var expected = selectedTab.waiAria ? 'true' : null;
            this._checkWidgetAttribute(selectedTab.tabId, 'aria-selected', expected);
            this._checkWidgetAttribute(selectedTab.tabId, 'aria-expanded', expected);

            ariaUtilsArray.forEach(tabs, function (tab) {
                if (tab !== selectedTab) {
                    var expected = selectedTab.waiAria ? 'false' : null;
                    this._checkWidgetAttribute(tab.tabId, 'aria-selected', expected);
                    this._checkWidgetAttribute(tab.tabId, 'aria-expanded', expected);
                }
            }, this);

            this._checkAriaLabelledBy(group, tabIndex);

            // ---------------------------------------------------------- return

            callback();
        },

        _checkAriaLabelledBy : function (group, tabIndex) {
            // --------------------------------------------------- destructuring

            var tabs = group.tabs;
            var tab = tabs[tabIndex];

            var tabPanel = group.tabPanel;
            var tabPanelId = tabPanel.id;

            // ------------------------------------------------------ processing

            var expected;
            if (tab.waiAria && tabPanel.waiAria) {
                var tabWidget = this.getWidgetInstance(tab.tabId);
                expected = tabWidget._domId;
            } else {
                expected = null;
            }

            this._checkWidgetAttribute(tabPanelId, 'aria-labelledby', expected);
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

                return ariaUtilsString.substitute(message, [selectedTab, id]);
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
