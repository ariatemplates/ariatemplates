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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.ListData",
    $prototype : {

        data : {
            selectDisabled1 : false,
            multipleSelect1 : false,
            selectDisabled2 : false,
            multipleSelect23 : false,
            selectDisabled3 : false,

            listItems1 : [{
                        value : 0,
                        label : 'Item1 with value 0'
                    }, {
                        value : 1,
                        label : 'Item2 with value 1'
                    }, {
                        value : 2,
                        label : 'Item3 with value 2'
                    }],

            listItems2 : [{
                        value : 2,
                        label : 'Item1 with value 2'
                    }, {
                        value : 1,
                        label : 'Item2 with value 1'
                    }, {
                        value : 0,
                        label : 'Item3 with value 0'
                    }],

            selectedValues : [0],

            countries : [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }, {
                        value : "US",
                        label : "United States"
                    }, {
                        value : "ES",
                        label : "Spain"
                    }, {
                        value : "PL",
                        label : "Poland"
                    }, {
                        value : "SE",
                        label : "Sweden"
                    }, {
                        value : "USA",
                        label : "United States of America"
                    }]
        }

    }
});
