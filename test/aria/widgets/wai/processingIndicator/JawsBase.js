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
var times = require('ariatemplates/utils/Algo').times;

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.processingIndicator.JawsBase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        var useCase = this.useCase;
        if (this.useCase)

        this.setTestEnv({
            template : 'test.aria.widgets.wai.processingIndicator.Tpl',
            data: this.useCase
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
            var data = this._getData();
            var elements = data.elements;
            var toggleOverlay = elements.toggleOverlay;

            var regexps = [];
            regexps.push(this._createLineRegExp('focus me*'));
            regexps.push(this._createLineRegExp('AT tests.*'));
            regexps.push(this._createLineRegExp(toggleOverlay.content + '.*'));

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

            // global ----------------------------------------------------------

            var document = Aria.$window.document;

            // data ------------------------------------------------------------

            var data = this._getData();

            // data > configuration --------------------------------------------

            var listeningTime = data.listeningTime;

            // data > options --------------------------------------------------

            var reverse = data.reverse;
            // var section = data.section;
            var navigationKey = data.navigationKey;

            // data > elements -------------------------------------------------

            var elements = data.elements;
            var toggleOverlay = elements.toggleOverlay;
            var previous = elements.previous;
            var loading = elements.loading;
            var next = elements.next;
            var startingPoint = elements[reverse ? 'after' : 'before'];

            // ------------------------------------------------------ processing

            var startingPointElement = document.getElementById(startingPoint.id);
            var toggleOverlayElement = this.getElementById(toggleOverlay.id);

            var traversedElements = [previous, next];
            if (reverse) {
                traversedElements.reverse();
            }
            var first = traversedElements[0];
            var last = traversedElements[1];

            function scenario(api) {
                // ----------------------------------------------- destructuring

                var click = api.click;
                var says = api.says;
                var delay = api.delay;

                // --------------------------------------------- local functions

                // individual actions ------------------------------------------

                function focusStartingPoint() {
                    click(startingPointElement);
                }

                function pressAction() {
                    click(toggleOverlayElement);
                }

                function pressNavigationKey() {
                    api[navigationKey]();
                }

                // isolated sequences ------------------------------------------

                function normalPass() {
                    focusStartingPoint();

                    times(3, pressNavigationKey);
                    says(first.content);
                    says(loading.content);
                    says(last.content);
                }

                function loadingPass() {
                    focusStartingPoint();

                    times(2, pressNavigationKey);
                    says(first.content);
                    says(last.content);

                    delay(listeningTime);
                    says(loading.message);
                    says(loading.message);
                }

                // full scenario -----------------------------------------------

                function fullPass() {
                    normalPass();

                    pressAction();
                    loadingPass();

                    pressAction();
                    normalPass();
                }

                // -------------------------------------------------- processing

                fullPass();
            }

            // execution -------------------------------------------------------

            this._executeStepsAndWriteHistory(callback, function (api) {
                api.defaultDelay = data.stepsDefaultDelay;
                scenario(api);
            });
        }
    }
});
