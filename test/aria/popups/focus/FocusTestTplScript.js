/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.popups.focus.FocusTestTplScript",
    $dependencies : ['aria.utils.validators.Mandatory'],
    $prototype : {
        $dataReady : function () {
            aria.utils.Data.setValidator(this.data, "firstName", new aria.utils.validators.Mandatory("MANDATORY."));
            aria.utils.Data.setValidator(this.data, "lastName", new aria.utils.validators.Mandatory("MANDATORY."));
        },
        $viewReady : function () {
            this.myMethod();
        },
        myMethod : function () {
            aria.utils.Data.validateModel(this.data, {});
        },
        submit : function () {
            this.myMethod();
        },
        anchorClick : function () {
            this.data.error = true;
        }

    }
});
