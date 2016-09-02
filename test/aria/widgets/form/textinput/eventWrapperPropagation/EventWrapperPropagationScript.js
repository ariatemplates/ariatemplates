/*
 * Copyright 2012-present Amadeus s.a.s.
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

Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.form.textinput.eventWrapperPropagation.EventWrapperPropagationScript",
    $prototype : {
        __storeEventWrapper: function(name, wrapper) {
            aria.utils.Json.setValue(this.data, name, wrapper);
        },

        onTextFieldClick: function(evt) {
            this.__storeEventWrapper("textFieldClickEW", evt);
        },

        onTextFieldBlur: function(evt) {
            this.__storeEventWrapper("textFieldBlurEW", evt);
        },

        onSelectBoxFocus: function(evt) {
            this.__storeEventWrapper("selectBoxFocusEW", evt);
        },

        onSelectBoxClick: function(evt) {
            this.__storeEventWrapper("selectBoxClickEW", evt);
        }
    }
});
