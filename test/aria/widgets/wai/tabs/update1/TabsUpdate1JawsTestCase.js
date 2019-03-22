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
var ariaUtilsFunction = require('ariatemplates/utils/Function');

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.update1.TabsUpdate1JawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

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
            var regexps = [];
            regexps.push(/Use JawsKey\+Alt\+M to move to controlled element/g);
            regexps.push(this._createLineRegExp(' *')); // empty line
            regexps.push(/ +(?=\s)/g); // multiple consecutive spaces
            regexps.push(this._createLineRegExp(this._getData().elementBefore.textContent));

            this._filter = ariaUtilsFunction.bind(this._applyRegExps, this, regexps);

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

                var step = api.step;
                var says = api.says;

                var down = api.down;
                var space = api.space;
                var tabulation = api.tabulation;

                // --------------------------------------------- local functions

                var self = this;

                function selectStartPoint() {
                    step(['click', self.getElementById(elementBefore.id)]);
                }

                function getTabDescription(tab, useJawsNavigation) {
                    var description = [];
                    if (useJawsNavigation) {
                        if (tab.wrapper != null) {
                            description.push(tab.wrapperText);
                        }
                        description.push('Link collapsed');
                        if (!tab.labelId) {
                            description.push(tab.title);
                        } else {
                            description.push(tab.textContent);
                        }
                    } else {
                        description.push(tab.title);
                        if (tab.wrapper != null) {
                            description.push(tab.wrapperText);
                            description.push('Link collapsed');
                        } else {
                            description.push('collapsed Link');
                        }
                    }
                    says(description.join(' '));
                    
                    if (!useJawsNavigation && tab.description != null) {
                        says(tab.description);
                    }
                }

                function goThroughTabs(useJawsNavigation) {
                    var stepForward = useJawsNavigation ? down : tabulation;

                    ariaUtilsArray.forEach(tabs, function (tab, index) {
                        if (tab.hidden) {
                            if (!useJawsNavigation) {
                                stepForward();
                            }
                            return;
                        }

                        if (useJawsNavigation && tab.wrapper != null) {
                            stepForward();
                        }

                        stepForward();
                        getTabDescription(tab, useJawsNavigation);
                    });
                }

                // -------------------------------------------------- processing

                // -------------------------------------------------------------

                selectStartPoint();

                goThroughTabs(false);

                tabulation();
                says(elementInside.textContent);

                // -------------------------------------------------------------

                selectStartPoint();

                goThroughTabs(true);

                // -------------------------------------------------------------

                space();
                says(elementInside.textContent);
            });
        }
    }
});
