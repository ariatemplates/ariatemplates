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

{Template {
    $classpath:"test.aria.widgets.form.selectbox.checkTypeLetters.SelectBoxTypeAllLettersTestCaseTpl",
    $hasScript:false
}}

    {var selectBoxData={}/}

    {macro main()}
        {var data = {
            selectDisabled1 : false,
            multipleSelect1 : false,
            selectDisabled2 : false,
            multipleSelect23 : false,
            selectDisabled3 : false,
            selectedLocale: aria.core.environment.Environment.getLanguage(),

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
            },{
                value : "UK",
                label : "United Kingdom"
            },{
                value : "US",
                label : "United States"
            },{
                value : "ES",
                label : "Spain"
            },{
                value : "PL",
                label : "Poland"
            },{
                value : "SE",
                label : "Sweden"
            },{
                value : "USA",
                label : "United States of America"
            }],
            locales : [{
                value : "fr_FR",
                label : "French (fr_FR)"
            }, {
                value : "en_US",
                label : "English (en_US)"
            },{
                value : "sv_SE",
                label : "Swedish (sv_SE)"
            },{
                value : "pl_PL",
                label : "Polish (pl_PL)"
            },{
                value : "it_IT",
                label : "Italian (it_IT)"
            }]
        }/}
        <p>Here is a default Select Box:</p>
        {@aria:SelectBox {
            label: "Some Countries: ",
            labelWidth:220,
            helptext:"Type text or select",
            options: data.countries,
            id: "selectBox1"
        }/}


    {/macro}

{/Template}
