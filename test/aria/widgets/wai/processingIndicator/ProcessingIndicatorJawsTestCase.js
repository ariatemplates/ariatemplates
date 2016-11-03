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

var EnhancedJawsTestCase = require('test/EnhancedJawsBase');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.processingIndicator.ProcessingIndicatorJawsTestCase',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.widgets.wai.processingIndicator.Tpl',
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
            var data = this._getData();
            var elements = data.elements;
            var toggleDivOverlay = elements.toggleDivOverlay;
            var toggleSectionOverlay = elements.toggleSectionOverlay;

            var regexps = [];
            regexps.push(this._createLineRegExp('focus me*'));
            regexps.push(this._createLineRegExp('AT tests.*'));
            regexps.push(this._createLineRegExp(toggleDivOverlay.content + '.*'));
            regexps.push(this._createLineRegExp(toggleSectionOverlay.content + '.*'));

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

            var data = this._getData();
            var listeningTime = data.listeningTime;

            var elements = data.elements;

            var before = elements.before;

            var div = elements.div;
            var section = elements.section;

            var toggleDivOverlay = elements.toggleDivOverlay;
            var toggleSectionOverlay = elements.toggleSectionOverlay;

            // -----------------------------------------------------------------

            var expectedOutput = [
                // -------------------------------------------------------------
                // Normal state

                div.content,
                section.content,

                // -------------------------------------------------------------
                // Processing indicator on the div

                // div's content is not said anymore, there is the loading indicator
                section.content,
                div.message,
                // We are waiting a suitable time to have it said only this number of times
                div.message,
                div.message,
                // div.message,

                // -------------------------------------------------------------
                // Processing indicator on the section

                // section's content is not said anymore, there is the loading indicator
                div.content,
                section.message,
                // We are waiting a suitable time to have it said only this number of times
                section.message,
                section.message,
                // section.message,

                // -------------------------------------------------------------
                // Back to normal

                div.content,
                section.content
            ].join('\n');

            var elementBefore = document.getElementById(before.id);
            var elementToggleDivOverlay = this.getElementById(toggleDivOverlay.id);
            var elementToggleSectionOverlay = this.getElementById(toggleSectionOverlay.id);

            // ------------------------------------------------------ processing

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;
                var down = api.down;
                var delay = api.delay;

                api.defaultDelay = data.stepsDefaultDelay;

                // -------------------------------------------------- processing

                step(['click', elementBefore]);
                down();
                down();

                step(['click', elementToggleDivOverlay]);
                step(['click', elementBefore]);
                down();
                down();
                delay(listeningTime);
                step(['click', elementToggleDivOverlay]);

                step(['click', elementToggleSectionOverlay]);
                step(['click', elementBefore]);
                down();
                down();
                delay(listeningTime);
                step(['click', elementToggleSectionOverlay]);

                step(['click', elementBefore]);
                down();
                down();

                says(expectedOutput);
            });
        }
    }
});

