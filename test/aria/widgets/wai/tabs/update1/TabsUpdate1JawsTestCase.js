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

module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.tabs.update1.TabsUpdate1JawsTestCase',
    $extends : require('ariatemplates/jsunit/JawsTestCase'),

    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

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

    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var data = this.templateCtxt.data;
            var elementBefore = this.getElementById(data.elementBefore.id);

            this.execute([
                ['click', elementBefore],
                ['waitFocus', elementBefore],
                ['type', null, '[tab]'],
                ['pause', 200],
                ['type', null, '[tab]'],
                ['waitForJawsToSay', 'Two as internal label collapsed Link'],
                ['type', null, '[tab]'],
                ['waitForJawsToSay', 'Three as external label collapsed Link'],
                ['type', null, '[tab]'],
                ['waitForJawsToSay', /Four heading level\s+6.*Link\s+collapsed/],
                ['waitForJawsToSay', 'Fourth tab description'],
                ['type', null, '[tab]'],
                ['waitForJawsToSay', 'Element inside'],
                ['click', elementBefore],
                ['waitFocus', elementBefore],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Two as internal label'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', 'Link collapsed Three as external label'],
                ['type', null, '[down]'],
                ['waitForJawsToSay', /heading level\s+6.*Link\s+collapsed\s+Four/],
                ['type', null, '[space]'],
                ['waitForJawsToSay', 'Element inside']
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
