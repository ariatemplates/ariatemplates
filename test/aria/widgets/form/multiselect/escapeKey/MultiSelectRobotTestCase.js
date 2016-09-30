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
var subst = ariaUtilsString.substitute;



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.form.multiselect.escapeKey.MultiSelectRobotTestCase',

    $extends : require('test/EnhancedRobotBase'),

    $constructor : function () {
        this.$EnhancedRobotBase.constructor.call(this);

        this.setTestEnv({
            data: {
                id: 'multiSelect'
            }
        });
    },

    $prototype: {
        runTemplateTest : function () {
            var id = this._getData().id;

            var isOpen = this._createPredicate(function () {
                return this.isWidgetDropDownPopupOpened(id);
            }, function (shouldBeTrue) {
                return subst(
                    'Widget "%1" should have its dropdown %2',
                    id,
                    shouldBeTrue ? 'open' : 'closed'
                );
            }, this);

            this._localAsyncSequence(function (add) {
                add('_focusWidget', id);

                add('_pressShiftF10');
                add(isOpen.waitForTrue);

                add('_pressEscape');
                add(isOpen.waitForFalse);
            }, this.end);
        }
    }
});
