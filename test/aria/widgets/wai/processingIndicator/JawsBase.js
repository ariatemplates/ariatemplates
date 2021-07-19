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

module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.processingIndicator.JawsBase',
    $extends : require('aria/jsunit/JawsTestCase'),

    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

        var useCase = this.useCase;
        if (useCase) {
            this.setTestEnv({
                template : 'test.aria.widgets.wai.processingIndicator.Tpl',
                data: useCase
            });
        }
    },

    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var document = Aria.$window.document;
            var data = this.useCase;
            var listeningTime = data.listeningTime;
            var reverse = data.reverse;
            var navigationKey = data.navigationKey;
            var elements = data.elements;
            var toggleOverlay = elements.toggleOverlay;
            var previous = elements.previous;
            var loading = elements.loading;
            var next = elements.next;
            var startingPoint = elements[reverse ? 'after' : 'before'];
            var startingPointElement = document.getElementById(startingPoint.id);
            var toggleOverlayElement = this.getElementById(toggleOverlay.id);
            var first = reverse ? next : previous;
            var last = reverse ? previous : next;

            var actions = [];

            function focusStartingPoint() {
                actions.push(
                    ["click", startingPointElement],
                    ["waitFocus", startingPointElement]
                );
            }

            function pressAction() {
                actions.push(
                    ["click", toggleOverlayElement],
                    ["waitForJawsToSay", "toggle overlay"]
                );
            }

            function normalPass() {
                focusStartingPoint();

                actions.push(
                    ["type", null, navigationKey],
                    ["waitForJawsToSay", first.content],
                    ["type", null, navigationKey],
                    ["waitForJawsToSay", loading.content],
                    ["type", null, navigationKey],
                    ["waitForJawsToSay", last.content]
                );
            }

            function loadingPass() {
                focusStartingPoint();

                actions.push(
                    ["type", null, navigationKey],
                    ["waitForJawsToSay", first.content],
                    ["type", null, navigationKey],
                    ["waitForJawsToSay", last.content],
                    ["pause", listeningTime],
                    ["waitForJawsToSay", loading.message],
                    ["pause", listeningTime],
                    ["waitForJawsToSay", loading.message]
                );
            }

            function fullPass() {
                normalPass();

                pressAction();
                loadingPass();

                pressAction();
                normalPass();
            }

            fullPass();

            this.execute(actions, {
                fn: this.end,
                scope: this
            });
        }
    }
});
