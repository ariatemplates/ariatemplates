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



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.update1.TabsJawsTest',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsTestCase.constructor.call(this);

        var data = {};

        var binding = {
            inside: data,
            to: 'selectedTab'
        };

        var tabs = [
            {
                textContent: 'One',
                hidden: true
            },
            {
                textContent: 'Two',
                label: 'Two as internal label'
            },
            {
                textContent: 'Three',
                labelId: 'three_label',
                label: 'Three as external label'
            },
            {
                textContent: 'Four',
                descriptionId: 'four_description',
                description: 'Fourth tab description',
                wrapper: 'h6',
                wrapperText: 'heading level 6'
            }
        ];
        data.tabs = tabs;

        var labeledTabs = [];
        data.labeledTabs = labeledTabs;

        var describedTabs = [];
        data.describedTabs = describedTabs;

        ariaUtilsArray.forEach(tabs, function(tab, index) {
            // -----------------------------------------------------------------

            var configuration = tab.configuration;
            if (configuration == null) {
                configuration = {};
                tab.configuration = configuration;
            }

            var hidden = tab.hidden;

            var textContent = tab.textContent;

            var label = tab.label;
            var labelId = tab.labelId;

            var description = tab.description;
            var descriptionId = tab.descriptionId;

            var wrapper = tab.wrapper;

            // -----------------------------------------------------------------

            // -----------------------------------------------------------------

            configuration.tabId = 'tab_' + index;
            configuration.waiAria = true;
            configuration.bind = {
                selectedTab: binding
            };
            configuration.tabIndex = 0;

            // -----------------------------------------------------------------

            if (hidden != null) {
                configuration.waiHidden = hidden;
            }

            if (label != null) {
                if (labelId != null) {
                    configuration.waiLabelledBy = labelId;
                    labeledTabs.push(tab);
                } else {
                    configuration.waiLabel = label;
                }
            }

            if (description != null) {
                configuration.waiDescribedBy = descriptionId;
                describedTabs.push(tab);
            }

            if (wrapper != null) {
                configuration.waiTitleTag = wrapper;
            }

            // -----------------------------------------------------------------

            var title = label == null ? textContent : label;
            tab.title = title;
        });

        var tabPanel = {
            configuration: {
                id: 'tab_panel',
                macro: 'displayTabPanelContent',
                waiAria: true,
                tabIndex: -1,
                bind: {
                    selectedTab: binding
                }
            }
        };
        data.tabPanel = tabPanel;

        var elementBefore = {
            id: 'element_before',
            textContent: 'Element before'
        };
        data.elementBefore = elementBefore;

        var elementInside = {
            id: 'element_inside',
            textContent: 'Element inside'
        };
        data.elementInside = elementInside;

        this.setTestEnv({
            template : 'test.aria.widgets.wai.tabs.update1.Tpl',
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
            var data = this._getData();
            var elementBefore = data.elementBefore;

            this._filter = function (content) {
                function createLineRegExp(content) {
                    return new RegExp('^' + content + '\\s*\\n?', 'gm');
                }

                var regexps = [];
                regexps.push(createLineRegExp(elementBefore.textContent));

                ariaUtilsArray.forEach(regexps, function(regexp) {
                    content = content.replace(regexp, '');
                });

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
            var data = this._getData();

            var tabs = data.tabs;
            var tabPanel = data.tabPanel;
            var elementBefore = data.elementBefore;
            var elementInside = data.elementInside;

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.addStep;
                var entry = api.addToHistory;

                // --------------------------------------------- local functions

                var self = this;

                function selectStartPoint() {
                    step(['click', self.getElementById(elementBefore.id)]);
                }

                function getTabDescription(tab, key) {
                    // ---------------------------------------------------------

                    var isJawsNavigation = key === 'down';
                    var description = [];

                    // ---------------------------------------------------------

                    if (isJawsNavigation) {
                        if (tab.wrapper != null) {
                            description.push(tab.wrapperText);
                        } else {
                            entry(tab.textContent);
                        }
                    } else {
                        description.push(tab.title);
                    }

                    // ---------------------------------------------------------

                    description.push('Tab');
                    if (isJawsNavigation) {
                        description.push('closed');
                    }
                    description.push('collapsed');
                    if (!isJawsNavigation) {
                        description.push('Use JawsKey+Alt+R to read descriptive text');
                    }
                    if (isJawsNavigation && tab.wrapper != null) {
                        description.push(tab.textContent);
                    }
                    entry(description.join(' '));

                    // ---------------------------------------------------------

                    if (!isJawsNavigation) {
                        if (tab.labelId) {
                            entry(tab.textContent);
                        }

                        if (tab.description != null) {
                            entry(tab.description);
                        }
                        entry('To activate tab page press Spacebar.');
                    }
                }

                function goThroughTabs(key) {
                    var isJawsNavigation = key === 'down';

                    ariaUtilsArray.forEach(tabs, function (tab, index) {
                        if (isJawsNavigation && tab.hidden) {
                            return;
                        }

                        if (isJawsNavigation && tab.wrapper != null) {
                            step(['type', null, '[' + key + ']']);
                        }

                        step(['type', null, '[' + key + ']']);
                        getTabDescription(tab, key);
                    });
                }

                // -------------------------------------------------- processing

                // -------------------------------------------------------------

                selectStartPoint();

                goThroughTabs('tab');

                step(['type', null, '[tab]']);
                entry(elementInside.textContent);

                // -------------------------------------------------------------

                selectStartPoint();

                goThroughTabs('down');

                // -------------------------------------------------------------

                step(['type', null, '[space]']);
                entry(elementInside.textContent);
            });
        }
    }
});
