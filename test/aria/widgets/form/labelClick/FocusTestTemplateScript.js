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
    $classpath : "test.aria.widgets.form.labelClick.FocusTestTemplateScript",
    $dependencies : ['aria.resources.handlers.LCRangeResourceHandler', 'aria.resources.handlers.LCResourcesHandler'],
    $constructor : function () {
        this._lcHandler = new aria.resources.handlers.LCResourcesHandler();
        this._lcRangeHandler = new aria.resources.handlers.LCRangeResourceHandler();
    },
    $destructor : function () {
        this._lcHandler.$dispose();
        this._lcRangeHandler.$dispose();
    },
    $prototype : {
        getMACHandler : function () {

            this._lcHandler.setSuggestions([{
                        label : 'Air France',
                        code : 'AF',
                        value : "Air France",
                        disabled : false
                    }, {
                        label : 'Air Canada',
                        code : 'AC',
                        value : "Air Canada",
                        disabled : false
                    }, {
                        label : 'France',
                        code : 'Fr',
                        value : "France",
                        disabled : false
                    }, {
                        label : 'Finnair',
                        code : 'Fi',
                        value : "Finnair",
                        disabled : false
                    }]);
            return this._lcHandler;
        },
        getAutoCompleteHandler : function () {

            this._lcRangeHandler.setSuggestions([{
                        label : 'Air France',
                        code : 'AF',
                        value : "Air France",
                        disabled : false
                    }, {
                        label : 'Air Canada',
                        code : 'AC',
                        value : "Air Canada",
                        disabled : false
                    }, {
                        label : 'France',
                        code : 'Fr',
                        value : "France",
                        disabled : false
                    }, {
                        label : 'Finnair',
                        code : 'Fi',
                        value : "Finnair",
                        disabled : false
                    }]);
            return this._lcRangeHandler;
        }
    }
});
