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
    $classpath : "test.aria.widgets.form.datepicker.bindableMinMax.DatePickerTplScript",
    $prototype : {
        domKeyDown : function (evt) {
            if (evt.keyCode == evt.KC_ENTER) {
                this.$json.setValue(this.data, "submitValueDPInit", new Date(this.data.boundValueDPInit.getTime()));

                if (this.data.boundValueDPMinT) {
                    this.$json.setValue(this.data, "submitValueDPMinT", new Date(this.data.boundValueDPMinT.getTime()));
                } else {
                    this.$json.setValue(this.data, "submitValueDPMinT", null);
                }

                if (this.data.boundValueDPMinF) {
                    this.$json.setValue(this.data, "submitValueDPMinF", new Date(this.data.boundValueDPMinF.getTime()));
                } else {
                    this.$json.setValue(this.data, "submitValueDPMinF", null);
                }

                if (this.data.boundValueDPMaxT) {
                    this.$json.setValue(this.data, "submitValueDPMaxT", new Date(this.data.boundValueDPMaxT.getTime()));
                } else {
                    this.$json.setValue(this.data, "submitValueDPMaxT", null);
                }

                if (this.data.boundValueDPMaxF) {
                    this.$json.setValue(this.data, "submitValueDPMaxF", new Date(this.data.boundValueDPMaxF.getTime()));
                } else {
                    this.$json.setValue(this.data, "submitValueDPMaxF", null);
                }
            }
        }
    }
});
