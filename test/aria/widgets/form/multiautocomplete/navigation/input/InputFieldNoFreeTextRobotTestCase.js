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
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.input.InputFieldNoFreeTextRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.navigation.RobotBase",
    $constructor : function () {
        this.$RobotBase.constructor.call(this, 'Navigation in input field - no free text');
        this.data.freeText = false;
    },
    $prototype : {
        _initialization : [{
                    name : 'Insert one option',
                    method : 'selectSuggestions',
                    args : [['a']]
                }, {
                    name : 'Insert text to be inserted (this text has some matches)',
                    method : 'insertText',
                    args : ['a']
                }],

        _test : [{
                    name : 'Navigate left to go in highlighted mode',
                    method : 'pressLeftArrow'
                }, {
                    name : 'Check that the option is not added!',
                    method : 'checkInsertedOptionsCount',
                    args : [1]
                }]
    }
});
