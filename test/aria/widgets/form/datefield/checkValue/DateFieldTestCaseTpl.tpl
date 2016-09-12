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
    $classpath:"test.aria.widgets.form.datefield.checkValue.DateFieldTestCaseTpl"
}}

    {macro main()}

    <fieldset  class="fieldsetDemo">
        <p>
            {@aria:DateField {
               id: "date1",
               name : "date1",
               label : "Date 1",
               block: true,
               bind : {
                 value: {"to" : "date1", "inside": data}
             }
            }/}
            {@aria:DateField {
              id: "date2",
              name : "date2",
        label : "Date 2",
        block: true,
        bind : {
          value: {"to" : "date2", "inside": data},
          referenceDate:{to: "date1", inside:data}
        }
      }/}
      {@aria:DateField {
        id: "date3",
        name : "date3",
        label : "Date 3",
        block: true,
        bind : {
          value: {"to" : "date3", "inside": data},
          referenceDate:{to: "date2", inside:data}}
      }/}
      {@aria:TextField {
        id : "text1",
        name : "text1",
        label: "Dummy Text"
      }/}
        </p>
        </fieldset>

    {/macro}

{/Template}
