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
var ariaUtilsObject = require('ariatemplates/utils/Object');
var ariaUtilsFunction = require('ariatemplates/utils/Function');



module.exports = Aria.tplScriptDefinition({
    $classpath: 'test.aria.widgets.wai.input.actionWidget.TplScript',
    $destructor: function () {
        this.view.$dispose();
    },
    $prototype: {
        $dataReady: function() {
            var widgetsTypes = [];

            widgetsTypes.push(this._createAction({
                type: 'link'
            }));
            widgetsTypes.push(this._createAction({
                type: 'button'
            }));
            widgetsTypes.push(this._createAction({
                type: 'button',
                name: 'button_simple',
                commonWidgetConfiguration: {
                    sclass: 'simple'
                }
            }));
            widgetsTypes.push(this._createAction({
                type: 'icon_button',
                commonWidgetConfiguration: {
                    icon: 'std:confirm',
                    block: true,
                    width: 150
                },
                supportsLabel: false
            }));
            widgetsTypes.push(this._createAction({
                type: 'sort_indicator',
                commonWidgetConfiguration: {
                    sortName: 'SortByName',
                    view: this.view
                },
                canBeDisabled: false
            }));

            widgetsTypes = this._filterWidgetsTypes(widgetsTypes);

            this.data.widgetsTypes = widgetsTypes;
        },

        _createAction: function(spec) {
            // -------------------------------------- input arguments processing

            var type = spec.type;
            spec.type = type;

            var supportsLabel = spec.supportsLabel;
            if (supportsLabel == null) {
                supportsLabel = true;
            }
            spec.supportsLabel = supportsLabel;

            var canBeDisabled = spec.canBeDisabled;
            if (canBeDisabled == null) {
                canBeDisabled = true;
            }
            spec.canBeDisabled = canBeDisabled;

            var commonWidgetConfiguration = spec.commonWidgetConfiguration;
            if (commonWidgetConfiguration == null) {
                commonWidgetConfiguration = {};
            }
            spec.commonWidgetConfiguration = commonWidgetConfiguration;

            var name = spec.name;
            if (name == null) {
                name = type;
            }
            spec.name = name;

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            var label = 'this is the ' + name + ' label';

            // -----------------------------------------------------------------

            var externalLabel = {
                id: name + '_label',
                content: 'this is the ' + name + ' external label'
            };

            var externalDescription = {
                id: name + '_description',
                content: 'this is the ' + name + ' external description'
            };

            var elementBefore = {
                id: 'before_' + name,
                content: 'focus me'
            };

            var elementAfter = {
                id: 'after_' + name,
                content: 'stop here'
            };

            var elements = {
                before: elementBefore,
                after: elementAfter,
                label: externalLabel,
                description: externalDescription
            };

            // -----------------------------------------------------------------

            var widgets = [];

            widgets.push(this._createWidget(spec, {
                content: name + ' with label',
                configuration: {
                    waiLabel: label
                }
            }));

            widgets.push(this._createWidget(spec, {
                content: name + ' with external label',
                configuration: {
                    waiLabelledBy: externalLabel.id
                }
            }));

            widgets.push(this._createWidget(spec, {
                content: name + ' with external description',
                configuration: {
                    waiDescribedBy: externalDescription.id
                }
            }));

            if (canBeDisabled) {
                widgets.push(this._createWidget(spec, {
                    content: 'disabled ' + name,
                    configuration: {
                        disabled: true
                    }
                }));
            }
            widgets.push(this._createWidget(spec, {
                content: name + ': no wai ARIA',
                configuration: {
                    waiLabel: label,
                    waiLabelledBy: externalLabel.id,
                    waiDescribedBy: externalDescription.id,
                    waiAria: false
                }
            }));

            // ---------------------------------------------------------- return

            return {
                name: name,
                type: type,
                label: label,
                elements: elements,
                widgets: widgets
            };
        },

        _createWidget : function(common, spec) {
            // --------------------------------------------------- destructuring

            // common ----------------------------------------------------------

            var supportsLabel = common.supportsLabel;
            var commonWidgetConfiguration = common.commonWidgetConfiguration;

            // spec ------------------------------------------------------------

            var content = spec.content;
            var configuration = spec.configuration;

            // ------------------------------------------------------ processing

            ariaUtilsObject.assign(configuration, commonWidgetConfiguration);

            if (configuration.waiAria == null) {
                configuration.waiAria = true;
            }

            if (supportsLabel) {
                configuration.label = content;
            }

            // ---------------------------------------------------------- return

            return {
                content: content,
                configuration: configuration
            };
        },

        _filterWidgetsTypes: function(widgetsTypes) {
            return ariaUtilsArray.filter(
                widgetsTypes,
                ariaUtilsFunction.bind(this._keepWidgetTypePredicate, this)
            );
        },

        _keepWidgetTypePredicate: function(widgetType) {
            var selectedWidgetTypeName = this.data.selectedWidgetTypeName;
            return selectedWidgetTypeName == null || widgetType.name === selectedWidgetTypeName;
        }
    }
});
