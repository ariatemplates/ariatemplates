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
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.input.InputFieldRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.navigation.RobotBase",
    $constructor : function () {
        this.$RobotBase.constructor.call(this, 'Navigation in input field');
    },
    $prototype : {
        _initialization : [{
                    name : 'Focus input field',
                    method : 'focusInputField'
                }, {
                    name : 'Insert text to be in a usual use case (this text has some matches)',
                    method : 'insertText',
                    args : ['a']
                }],

        _test : [
                // Left in text and no selected option
                {
            name : 'Navigate left from within the text when there is no selected option',
            method : 'pressLeftArrow'
        }, {
            name : 'Check caret went back to 0',
            method : 'checkCaretAndFocus',
            args : [0]
        },

                // Left on the edge and no selected option
                {
                    name : 'Navigate left from the left edge of the input, without any selected option',
                    method : 'pressLeftArrow'
                }, {
                    name : 'Check caret remained at position 0',
                    method : 'checkCaretAndFocus',
                    args : [0]
                },

                // Insert options & go back to right
                {
                    name : 'Insert two options',
                    method : 'selectSuggestions',
                    args : [['a', 'a'], true]
                }, {
                    name : 'Navigate right to be within the text again',
                    method : 'pressRightArrow'
                },

                // Left in text and selected options present
                {
                    name : 'Navigate left from within the text when there are selected options',
                    method : 'pressLeftArrow'
                }, {
                    name : 'Check caret went back to 0',
                    method : 'checkCaretAndFocus',
                    args : [0]
                },

                // Left on the edge and selected options present
                {
                    name : 'Navigate left from the left edge of the input, now that there are options to highlight',
                    method : 'pressLeftArrow'
                }, {
                    name : 'Check that the index of the highlighted option is corresponding to the one that was the last',
                    method : 'checkHighlightedOption',
                    args : [2]
                }, {
                    name : 'Also check that in free text mode the current text is added',
                    method : 'checkInsertedOptionsCount',
                    args : [3]
                }]
    }
});
