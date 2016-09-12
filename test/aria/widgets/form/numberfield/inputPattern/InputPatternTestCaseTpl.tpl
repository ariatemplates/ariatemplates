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
    $classpath : "test.aria.widgets.form.numberfield.inputPattern.InputPatternTestCaseTpl"
}}

{macro main()}
{@aria:NumberField {
    label : "No pattern",
    id : "noPattern"
}/}

{@aria:NumberField {
    label : "Pattern",
    id : "pattern",
    pattern : "#,#,#.0",
    tabIndex : -1
}/}

{@aria:NumberField {
    label : "Pattern",
    id : "error",
    pattern : "\u00a4 #,#,#.0" // space is not allowed
}/}
{/macro}
{/Template}
