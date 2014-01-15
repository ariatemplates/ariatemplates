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
    $classpath:"test.aria.widgets.form.multiselect.focusIssue.MultiSelectTpl",
    $hasScript:false
}}

    {macro main()}
        <h1>This test needs focus</h1>
        {var testItems = {
          selected: 2,
          isChecked : false,
          items: [{
              value: "AF",
              label: "Air France",
              disabled: false
          },
          {
              value: "AC",
              label: "Air Canada",
              disabled: false
          },
          {
              value: "NZ",
              label: "Air New Zealand",
              disabled: false
          },
          {
              value: "DL",
              label: "Delta Airlines",
              disabled: false
          },
          {
              value: "AY",
              label: "Finnair",
              disabled: false
          },
          {
              value: "IB",
              label: "Iberia",
              disabled: true
          },
          {
              value: "LH",
              label: "Lufthansa",
              disabled: false
          },
          {
              value: "MX",
              label: "Mexicana",
              disabled: false
          },
          {
              value: "QF",
              label: "Quantas",
              disabled: false
          }],
          tableItems: [{
                  value: "AF1",
                  label: "Air France|1st Class|AF",
                  disabled: false
              },
              {
                  value: "AF2",
                  label: "Air France|Business Class|AF",
                  disabled: false
              },
              {
                  value: "AC1",
                  label: "Air Canada|1st Class|AF",
                  disabled: false
              },
              {
                  value: "AC2",
                  label: "Air Canada|Business Class|AF",
                  disabled: false
              }]
        }/}


      {@aria:MultiSelect {
        id:"ms1",
        activateSort : true,
        label : "Multi-select 1:",
        labelWidth : 150,
        width : 400,
        fieldDisplay : "code",
        fieldSeparator :',',
        valueOrderedByClick : true,
        maxOptions : 7,
        numberOfRows : 4,
        displayOptions : {
          flowOrientation : 'horizontal',
          listDisplay : "both",
          displayFooter : true
        },
        items : testItems.items,
        value : ["AC"]
      }/}



      {@aria:MultiSelect {
        id:"ms2",
        activateSort : true,
        label : "Multi-select 2:",
        labelWidth : 150,
        width : 400,
        fieldDisplay : "code",
        fieldSeparator : ',',
        valueOrderedByClick : true,
        maxOptions : 7,
        numberOfRows : 9,
        displayOptions : {
          flowOrientation :'horizontal',
          tableMode : true,
          listDisplay : "both"
        },
        items : testItems.tableItems,
        value : ["AF1"]
      }/}


    {/macro}

{/Template}
