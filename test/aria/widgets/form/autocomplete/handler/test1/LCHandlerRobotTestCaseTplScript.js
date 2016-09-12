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
    $classpath : 'test.aria.widgets.form.autocomplete.handler.test1.LCHandlerTestCaseTplScript',
    $dependencies : ['aria.resources.handlers.LCResourcesHandler'],
    $constructor : function () {
        this.iatacityHandler = new aria.resources.handlers.LCResourcesHandler({
                                    labelKey: "mykey",
                                    codeKey: "mycode",
                                    sortingMethod: function (a, b) {
                                        return (a.mykey < b.mykey) ? 1 : (a.mykey > b.mykey) ? -1 : 0;
                                    },
                                    codeExactMatch: false,
                                    threshold: 2});
        this.iatacityHandler.setSuggestions([{
                    mykey : 'Aalborg',
                    mycode : 'AAL'
                }, {
                    mykey : 'Aarhus',
                    mycode : 'AAR'
                }, {
                    mykey : 'Scotland',
                    mycode : 'ABZ'
                }, {
                    mykey : 'Aberdeen',
                    mycode : 'ABR'
                }, {
                    mykey : 'Adana',
                    mycode : 'ADK'
                }, {
                    mykey : 'Adak Island',
                    mycode : 'ADA'
                }]);
                this.airlinesHandler = new aria.resources.handlers.LCResourcesHandler();
                this.airlinesHandler.setSuggestions([{
                    label : 'Air France',
                    code : 'AF'
                }, {
                    label : 'Air Canada',
                    code : 'AC'
                }, {
                    label : 'Finnair',
                    code : 'XX'
                }, {
                    label : 'Quantas',
                    code : 'QF'
                }, {
                    label : 'American Airlines',
                    code : 'AA'
                }, {
                    label : 'Emirates',
                    code : 'EK'
                }]);
        this.airlinesHandler.codeExactMatch = true;

    },
    $destructor : function () {
      this.iatacityHandler.$dispose();
      this.airlinesHandler.$dispose();
    },
    $prototype : {
        getAirLinesHandler : function (arg) {
            var handler = (arg==="city") ? this.iatacityHandler : this.airlinesHandler;
            return handler;

        }
    }
});
