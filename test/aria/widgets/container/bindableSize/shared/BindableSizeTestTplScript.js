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
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.container.bindableSize.shared.BindableSizeTestTplScript',
    $prototype : {
        buttonClickPlus : function () {
            this.$json.setValue(this.data, "width", this.data.width + 40);
            this.$json.setValue(this.data, "height", this.data.height + 40);
        },
        buttonClickMinus : function () {
            this.$json.setValue(this.data, "width", this.data.width - 30);
            this.$json.setValue(this.data, "height", this.data.height - 30);
        },
        buttonClick166 : function () {
            this.$json.setValue(this.data, "width", 166);
            this.$json.setValue(this.data, "height", 166);
        },
        buttonClick666 : function () {
            this.$json.setValue(this.data, "width", 666);
            this.$json.setValue(this.data, "height", 666);
        },
        buttonClick400x300 : function () {
            this.$json.setValue(this.data, "width", 400);
            this.$json.setValue(this.data, "height", 300);
        }
    }
});
