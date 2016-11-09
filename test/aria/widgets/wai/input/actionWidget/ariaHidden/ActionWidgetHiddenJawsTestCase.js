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

var ariaUtilsAlgo = require('ariatemplates/utils/Algo');
var ariaUtilsArray = require('ariatemplates/utils/Array');

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.input.actionWidget.ariaHidden.ActionWidgetHiddenJawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        this._expectedHistory = [
            'Link waiAria link',
            'waiAria button', 'Button',
            'waiAria button (simple)', 'Button',
            'waiAria iconButton', 'Button',
            'Link waiAria sortIndicator'
        ].join('\n');

        this.setTestEnv({
            template : 'test.aria.widgets.wai.input.actionWidget.ariaHidden.Tpl',
            data: {}
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $prototype : {
        skipRemoveDuplicates: true,



        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            var regexps = [];
            regexps.push(this._createLineRegExp('focus me.*'));
            regexps.push(this._createLineRegExp('AT tests.*'));

            this._filter = function (content) {
                return this._applyRegExps(regexps, content);
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
            // --------------------------------------------------- destructuring

            var document = Aria.$window.document;

            var expectedHistory = this._expectedHistory;

            var data = this._getData();
            var elementBefore = data.elements.before;
            var widgetsList = data.widgetsList;

            // ------------------------------------------------------ processing

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;
                var down = api.down;

                // -------------------------------------------------- processing

                step(['click', document.getElementById(elementBefore.id)]);
                ariaUtilsAlgo.times(widgetsList.length, down);
                says(expectedHistory);
            });
        }
    }
});

