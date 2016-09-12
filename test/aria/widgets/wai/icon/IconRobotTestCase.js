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

var ariaUtilsString = require('ariatemplates/utils/String');
var ariaUtilsJson = require('ariatemplates/utils/Json');



////////////////////////////////////////////////////////////////////////////////
// Model: Icon
////////////////////////////////////////////////////////////////////////////////

function Icon(id, waiAria, label) {
    // -------------------------------------------------------------- properties

    this.id = id;
    this.waiAria = waiAria;
    this.label = label;

    // -------------------------------------------------------------- attributes

    var configuration = {
        id: id,
        waiAria: waiAria,

        icon: 'std:info',
        onclick: 'incrementCalledCounter',

        label: label
    };

    if (waiAria) {
        configuration.role = 'button';
        configuration.tabIndex = 0;
    }

    this.configuration = configuration;
}



////////////////////////////////////////////////////////////////////////////////
// Tests
////////////////////////////////////////////////////////////////////////////////

module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.icon.IconRobotTestCase',
    $extends : require('test/EnhancedRobotBase'),

    $constructor : function () {
        // ------------------------------------------------------ initialization

        this.$EnhancedRobotBase.constructor.call(this);

        // ---------------------------------------------------------- processing

        var label = 'waiLabel';

        var icons = [];
        var iconsIndex = {};
        function addIcon(id, waiAria) {
            var icon = new Icon(id, waiAria, label);

            icons.push(icon);
            iconsIndex[id] = icon;
        }

        addIcon('waiEnabled', true);
        addIcon('waiDisabled', false);

        this.setTestEnv({
            data: {
                icons: icons,
                iconsIndex: iconsIndex,
                calledCounter: 0,
                label: label
            }
        });
    },

    $prototype: {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            this._asyncIterate(
                this._getData().icons,
                this._testIcon,
                this.end
            );
        },



        ////////////////////////////////////////////////////////////////////////
        // Tests: specific
        ////////////////////////////////////////////////////////////////////////

        _testIcon : function (callback, icon) {
            this._localAsyncSequence(function (add) {
                add('_testLabel', icon);
                add('_testRole', icon);

                add('_testTabFocus', icon);
                if (icon.waiAria) {
                    add('_testActionOnKeyDown', icon);
                }
            }, callback);
        },

        _testLabel : function (callback, icon) {
            // --------------------------------------------------- destructuring

            var data = this._getData();
            var waiAria = icon.waiAria;
            var widgetDom = this._getWidgetDom(icon.id);

            // ------------------------------------------------------ processing

            var condition;
            var message;

            var attributeValue = widgetDom.getAttribute('aria-label');
            if (waiAria) {
                var expectedValue = data.label;

                condition = attributeValue === expectedValue;
                message = ariaUtilsString.substitute(
                    'The icon should have a label with value "%1", instead it has the value "%2"',
                    [expectedValue, attributeValue]
                );
            } else {
                condition = !attributeValue;
                message = ariaUtilsString.substitute(
                    'The icon should not have a label value, instead it has the value "%1"',
                    [attributeValue]
                );
            }

            this.assertTrue(condition, message);

            // ---------------------------------------------------------- return

            callback();
        },

        _testRole : function (callback, icon) {
            // --------------------------------------------------- destructuring

            var data = this._getData();
            var waiAria = icon.waiAria;
            var widgetDom = this._getWidgetDom(icon.id);

            // ------------------------------------------------------ processing

            var condition;
            var message;

            var attributeValue = widgetDom.getAttribute('role');
            if (waiAria) {
                var expectedValue = 'button';

                condition = attributeValue === expectedValue;
                message = ariaUtilsString.substitute(
                    'The icon should have a role with value "%1", instead it has the value "%2"',
                    [expectedValue, attributeValue]
                );
            } else {
                condition = !attributeValue;
                message = ariaUtilsString.substitute(
                    'The icon should not have a role, instead it has the value "%1"',
                    [attributeValue]
                );
            }

            this.assertTrue(condition, message);

            // ---------------------------------------------------------- return

            callback();
        },

        _testTabFocus : function (callback, icon) {
            // --------------------------------------------------- destructuring

            var id = icon.id;
            var waiAria = icon.waiAria;

            // ------------------------------------------------------ processing

            var isIconFocused = this._createPredicate(function () {
                return this._isWidgetFocused(id);
            }, function (shouldBeTrue) {
                return ariaUtilsString.substitute('Icon should%1be focused.', [
                    shouldBeTrue ? ' ' : ' not '
                ]);
            });

            this._localAsyncSequence(function (add) {
                add('_focusElementBefore', id);
                add('_pressTab');
                add('_waitForFocusChange');

                if (waiAria) {
                    add(isIconFocused.assertTrue);
                } else {
                    add(isIconFocused.assertFalse);
                }
            }, callback);
        },

        _testActionOnKeyDown : function (callback, icon) {
            // --------------------------------------------------- destructuring

            var data = this._getData();
            var id = icon.id;

            // ------------------------------------------------------ processing

            function check(next) {
                this.assertTrue(
                    data.calledCounter === 1,
                    'Icon action was not properly triggered when pressing action key while focused.'
                );

                ariaUtilsJson.setValue(data, 'calledCounter', 0);
            }
            this._createAsyncWrapper(check);

            this._localAsyncSequence(function (add) {
                add('_focusWidget', id);

                add('_pressEnter');
                add(check);

                add('_pressSpace');
                add(check);
            }, callback);
        }
    }
});
