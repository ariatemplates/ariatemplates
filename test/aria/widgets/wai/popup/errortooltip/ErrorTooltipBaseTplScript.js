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
    $classpath : "test.aria.widgets.wai.popup.errortooltip.ErrorTooltipBaseTplScript",
    $dependencies : ["aria.utils.Data", "aria.utils.validators.Mandatory", "aria.resources.handlers.LCResourcesHandler"],
    $constructor : function () {
        this.fieldIds = ["tf","ta","nf","df","time","dp","ac","ms","sb","mac"];
        this.airlinesHandler = new aria.resources.handlers.LCResourcesHandler();
        this.airlinesHandler.setSuggestions([{
                    label : 'Air France',
                    code : 'AF'
                }, {
                    label : 'Air Canada',
                    code : 'AC'
                }, {
                    label : 'Finnair',
                    code : '--'
                }, {
                    label : 'Quantas',
                    code : '--'
                }, {
                    label : 'American Airlines',
                    code : 'AA'
                }, {
                    label : 'Emirates',
                    code : '--'
                }]);
    },
    $destructor : function () {
        var fieldIds = this.fieldIds;
        var data = this.data;
        for(var i = 0, ii = fieldIds.length; i < ii; i++) {
            aria.utils.Data.unsetValidator(data, fieldIds[i]);
        }
        this.validator.$dispose();
        this.airlinesHandler.$dispose();
    },
    $prototype : {
        $dataReady : function () {
            var fieldIds = this.fieldIds;
            var data = this.data;
            var validator = this.validator = new aria.utils.validators.Mandatory("This field is mandatory");
            for(var i = 0, ii = fieldIds.length; i < ii; i++) {
                var id = fieldIds[i];
                data[id] = null;
                aria.utils.Data.setValidator(data, id, validator, null, "onblur");
            }
            aria.utils.Data.validateModel(data);
        }
    }
});
