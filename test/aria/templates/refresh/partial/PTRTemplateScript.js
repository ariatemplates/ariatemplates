/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : 'test.aria.templates.refresh.partial.PTRTemplateScript',
    $prototype : {
        $dataReady : function () {
            this.data["view:counts1"] = 1;
            this.data.textAfterRefresh = "";
        },

        updateCountAndRefresh : function (evt, args) {
            this.data["view:counts1" ]++;
            if(args){
                this.$refresh({
                   section : "Section1"
                });
            } else {
                this.$refresh();
            }

        },
        $afterRefresh : function(args) {
            var txt = (args.section) ? "After partial refresh" : "After full refresh";
            this.$json.setValue(this.data,'textAfterRefresh',txt);
        }
    }
});
