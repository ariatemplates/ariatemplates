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
    $classpath:"test.aria.widgets.form.multiselect.longlist.test1.MsLongListTpl",
    $hasScript:false
}}

    {var content = {value : []}/}

    {macro main()}
        <h1>This test needs focus</h1>
         {var seatCharacteristics = [
         {
             value:"3B",
             label:"Individual video screen-Choice of movies, games, information, etc.",
             disabled:false
         },
         {
             value:"AG",
             label:"Seat adjacent to galley",
             disabled:false
         },
         {
             value:"AS",
             label:"Individual airphone",
             disabled:false
         },
         {
             value:"CH",
             label:"Chargeable seat",
             disabled:false
         },
         {
             value:"EC",
             label:"Electronic connection for lap top or FAX machine",
             disabled:false
         },
         {
             value:"K",
             label:"Bulkhead seat",
             disabled:false
         },
         {
             value:"L",
             label:"Leg space seat",
             disabled:false
         },
         {
             value:"LS",
             label:"Left side of aircraft",
             disabled:false
         },
         {
             value:"PC",
             label:"Pet cabin",
             disabled:false
         },
         {
             value:"1",
             label:"Restricted seat - General",
             disabled:false
         },
         {
             value:"B",
             label:"Seat with bassinet facility",
             disabled:false
         },
         {
             value:"RS",
             label:"Right side of aircraft",
             disabled:false
         },
         {
             value:"H",
             label:"Seat with facilities for handicapped/incapacitated passenger",
             disabled:false
         },
         {
             value:"7A",
             label:"In front of toilet seat",
             disabled:false
         },
         {
             value:"I",
             label:"Seat suitable for adult with an infant",
             disabled:false
         },
         {
             value:"1A",
             label:"Seat not allowed for infant",
             disabled:false
         },
         {
             value:"1B",
             label:"Seat not allowed for medical",
             disabled:false
         },
         {
             value:"1C",
             label:"Seat not allowed for unaccompanied minor",
             disabled:false
         },
         {
             value:"E",
             label:"Exit row seat",
             disabled:false
         },
         {
             value:"IE",
             label:"Seat not suitable for child",
             disabled:false
         },
         {
             value:"8",
             label:"8",
             disabled:false
         },
         {
             value:"A",
             label:"Aisle seat",
             disabled:false
         },
         {
             value:"6A",
             label:"In front of galley seat",
             disabled:false
         },
         {
             value:"U",
             label:"Seat suitable for unaccompanied minors",
             disabled:false
         },
         {
             value:"V",
             label:"Seat to be left vacant or offered last",
             disabled:false
         },
         {
             value:"DE",
             label:"Deportee",
             disabled:false
         },
         {
             value:"AL",
             label:"Seat adjacent to lavatory",
             disabled:false
         }
         ] /}

         {@aria:MultiSelect {
             id: "ms1",
             activateSort: true,
             label: "Filter available seats",
             labelWidth:150,
             width:600,
             fieldDisplay: "label",
             fieldSeparator:', ',
             numberOfColumns:1,
             displayOptions : {
                 flowOrientation:'vertical',
                 listDisplay: "label",
                 displayFooter : true
             },
             items: seatCharacteristics
         }/}
    {/macro}

{/Template}
