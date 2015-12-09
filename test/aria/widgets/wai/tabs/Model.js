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

var ariaUtilsArray = require('ariatemplates/utils/Array');



////////////////////////////////////////////////////////////////////////////////
// Models: Group (TabPanel + tabs), TabPanel, Tab
////////////////////////////////////////////////////////////////////////////////

function Group(waiAria, id, bindingContainer, macro, tabsUnder) {
    // -------------------------------------------------------------- properties

    this.waiAria = waiAria;
    this.id = id;
    this.elementBeforeId = 'before_' + id;

    if (tabsUnder == null) {
        tabsUnder = false;
    }
    this.tabsUnder = tabsUnder;

    // -------------------------------------------------------------- attributes

    var binding = {
        inside: bindingContainer,
        to: id
    };
    this.binding = binding;

    var tabPanel = new TabPanel(waiAria, id, binding, macro);
    this.tabPanel = tabPanel;

    var tabs = [];
    this.tabs = tabs;

    for (var index = 0, length = 3; index < length; index++) {
        var label = 'Tab ' + index;
        var tabId = id + '_tab_' + index;
        var disabled = index === 1 ? true : false;

        var tab = new Tab(waiAria, tabId, binding, label, disabled);

        tabs.push(tab);
    }
}

function TabPanel(waiAria, id, binding, macro) {
    // -------------------------------------------------------------- properties

    this.waiAria = waiAria;
    this.id = id;

    // -------------------------------------------------------------- attributes

    this.configuration = {
        id: id,
        bind: {
            selectedTab: binding
        },
        macro: {
            name: macro,
            args: [this]
        },
        tabIndex: 0,
        waiAria: waiAria
    };
}

function Tab(waiAria, tabId, binding, label, disabled) {
    // -------------------------------------------------------------- properties

    this.waiAria = waiAria;
    this.tabId = tabId;
    this.label = label;
    this.disabled = disabled;
    this.binding = binding;

    // -------------------------------------------------------------- attributes

    this.configuration = {
        id: tabId,
        disabled: disabled,
        tabId: tabId,
        bind: {
            selectedTab: binding
        },
        sclass: 'simple',
        tabIndex: 0,
        waiAria: waiAria
    };
}



////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

function buildData(index) {
    var macro = 'displayTabPanel';
    var bindingContainer = {};

    var groups = [];

    ariaUtilsArray.forEach([
        {
            id: 'up',
            waiAria: false,
            tabsUnder: false
        },
        {
            id: 'down',
            waiAria: false,
            tabsUnder: true
        },
        {
            id: 'up_waiAria',
            waiAria: true,
            tabsUnder: false
        },
        {
            id: 'down_waiAria',
            waiAria: true,
            tabsUnder: true
        }
    ], function (spec) {
        groups.push(new Group(
            spec.waiAria,
            spec.id,
            bindingContainer,
            macro,
            spec.tabsUnder
        ));
    });

    return {
       groups: groups,
       bindingContainer: bindingContainer
    };
}



////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

exports.Group = Group;
exports.Tab = Tab;
exports.TabPanel = TabPanel;

exports.buildData = buildData;
