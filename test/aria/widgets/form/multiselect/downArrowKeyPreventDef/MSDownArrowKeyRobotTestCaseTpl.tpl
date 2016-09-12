/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath:"test.aria.widgets.form.multiselect.downArrowKeyPreventDef.MSDownArrowKeyTpl",
    $hasScript:false
}}

    {macro main()}
        <div style="height:3000px;"></div>
        <h1>This test needs focus</h1>
        {@aria:MultiSelect {
            id :"happyMS",
            label : "What do you need to be happy?",
            labelWidth : 200,
            width: 650,
            numberOfRows:4,
            displayOptions : {
                listDisplay : "label"
            },
            items : [
                {label : "God", value : "God"},
                {label : "Love", value : "Love"},
                {label : "Forgiveness", value : "Forgiveness"},
                {label : "Hope", value : "Hope"},
                {label : "A spouse", value : "spouse"},
                {label : "Good friends", value : "goodfriends"},
                {label : "Food", value : "Food"},
                {label : "Clothing", value : "Clothing"},
                {label : "Shelter", value : "Shelter"},
                {label : "A good job", value : "goodjob"},
                {label : "A car", value : "car"},
                {label : "A good computer", value : "goodcomputer"},
                {label : "A smartphone", value: "smartphone"},
                {label : "JavaScript", value : "Javascript"},
                {label : "A good browser", value: "goodbrowser"},
                {label : "Aria Templates", value : "ariatemplates"}
            ]
        }/}
        <div style="height:3000px;"></div>
    {/macro}

{/Template}
