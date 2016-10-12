/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.highlighting.HighlightingRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.navigation.RobotBase",
    $constructor : function () {
        this.$RobotBase.constructor.call(this, 'Navigation in highlighted mode');
    },
    $prototype : {
        _initialization : [{
                    name : 'Insert options',
                    method : 'selectSuggestions',
                    args : [['a', 'a']]
                }, {
                    name : 'Select last option with navigation',
                    method : 'pressLeftArrow'
                }],

        _test : [{
                    name : 'Left navigation in highlighted mode',
                    children : '__testLeftNavigationInHighlightedMode'
                }, {
                    name : 'Right navigation in highlighted mode',
                    children : '__testRightNavigationInHighlightedMode'
                }],

        __testLeftNavigationInHighlightedMode : [{
                    name : 'Navigate left while in highlighted mode',
                    method : 'pressLeftArrow'
                }, {
                    name : 'Check that the previous option has been highlighted (exclusively)',
                    method : 'checkHighlightedOption',
                    args : [1]
                }, {
                    name : 'Navigate left while on the left edge of the selected options container',
                    method : 'pressLeftArrow'
                }, {
                    name : 'Check that nothing changed',
                    method : 'checkHighlightedOption',
                    args : [1]
                }],

        __testRightNavigationInHighlightedMode : [{
                    name : 'Navigate right while in highlighted mode',
                    method : 'pressRightArrow'
                }, {
                    name : 'Check that the next option has been highlighted (exclusively)',
                    method : 'checkHighlightedOption',
                    args : [2]
                }, {
                    name : 'Navigate right beyond the right edge of the list of selected options',
                    method : 'pressRightArrow'
                }, {
                    name : 'Check that the highlighted mode is off',
                    method : 'shouldBeInHighlightedMode',
                    args : [false]
                }, {
                    name : 'Also check that the input field has focus and the caret is at its beginning',
                    method : 'checkCaretAndFocus',
                    args : [0]
                }]
    }
});
