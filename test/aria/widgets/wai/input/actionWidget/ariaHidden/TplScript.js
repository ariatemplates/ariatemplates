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



module.exports = Aria.tplScriptDefinition({
    $classpath: 'test.aria.widgets.wai.input.actionWidget.ariaHidden.TplScript',
    $destructor: function () {
        this.view.$dispose();
    },
    $prototype: {
        $dataReady: function() {
            // -----------------------------------------------------------------

            var data = this.data;

            // -----------------------------------------------------------------

            var elementBefore = {
                id: 'element_before',
                content: 'focus me'
            };
            var elements = {
                before: elementBefore
            };
            data.elements = elements;

            // -----------------------------------------------------------------

            var widgetsList = [];

            widgetsList.push({
                key: 'link',
                label: 'link'
            });

            widgetsList.push({
                key: 'button',
                label: 'button'
            });

            widgetsList.push({
                key: 'simpleButton',
                label: 'button (simple)',
                configuration: {
                    sclass: 'simple'
                }
            });

            widgetsList.push({
                key: 'iconButton',
                label: 'iconButton',
                onlyWaiLabel: true,
                configuration: {
                    icon: 'std:confirm',
                    block: true,
                    width: 150
                }
            });

            widgetsList.push({
                key: 'sortIndicator',
                label: 'sortIndicator',
                configuration: {
                    sortName: 'SortByName',
                    view: this.view
                }
            });

            var widgetsMap = {};
            ariaUtilsArray.forEach(widgetsList, function (widget) {
                var key = widget.key;
                var label = widget.label;
                var onlyWaiLabel = widget.onlyWaiLabel;
                var configuration = widget.configuration;
                if (configuration == null) {
                    configuration = {};
                    widget.configuration = configuration;
                }

                configuration.waiAria = true;
                configuration.waiLabelHidden = true;
                if (!onlyWaiLabel) {
                    configuration.label = label;
                }
                configuration.waiLabel = 'waiAria ' + label;

                widgetsMap[key] = {
                    widget: widget,
                    configuration: configuration
                };
            });
            data.widgets = widgetsMap;
            data.widgetsList = widgetsList;
        }
    }
});
