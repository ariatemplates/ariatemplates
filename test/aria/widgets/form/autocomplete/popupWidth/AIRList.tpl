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

// Default template for List Widget
{Template {
    $classpath:"test.aria.widgets.form.autocomplete.popupWidth.AIRList",
    $extends:"aria.widgets.form.list.templates.ListTemplate",
    $hasScript:true
}}
    {var inCity=''/}
    {var inCountry=''/}

    {macro main()}

        // The Div is used to wrap the items with good looking border.
        {@aria:Div data.cfg}

                {section {
                    id:'Items',
                    type:"div",
                    macro : "displayItems"
                }/}

        {/@aria:Div}
    {/macro}

    {macro displayItems()}
        <table
                {if !data.disabled}
                    {on mouseup {fn: "itemClick"} /}
                    {on mouseover {fn: "itemMouseOver"} /}
                {/if}

                cellpadding="0"
                cellspacing="0"
                // release hack. table does not take all available width, but does not break the display. FIXME
                ${(aria.core.Browser.isIE7 && data.cfg.width != null && data.cfg.width <= 0) ? "" : "style='width:100%'"}
        >
            <tbody {id "suggestionsRows" /}    >

                {for var i=0;i<data.items.length;i++}
                    {call renderItem(data.items[i], i)/}
                {/for}

            </tbody>
        </table>
    {/macro}

    {macro renderItem(item, itemIdx)}
        <tr class="${_getClassForItem(item)}" data-itemIdx="${itemIdx}">

            <td style="padding:0px; border:none;">
                {var suggestion = item.object.value/}
                {var entry = item.object.entry/}
                {if ((suggestion.cityName && !suggestion.airportName) || suggestion.type == 7)}
                    {set inCity = suggestion.cityName/}
                    {set inCountry = suggestion.countryName/}

                    {@aria:Icon    {icon:"autoCompleteAirTrain:multiple_airport"}/}

                {else/}
                    {if ((inCity && suggestion.cityName===inCity) && (inCountry && suggestion.countryName===inCountry))}
                        {@aria:Icon    {icon:"autoCompleteAirTrain:sub"}/}
                    {/if}
                    {@aria:Icon    {icon:"autoCompleteAirTrain:airport"}/}
                {/if}
                &nbsp;${suggestion.cityName|startHighlight:entry|escapeForHTML:false}, ${suggestion.airportName|startHighlight:entry|escapeForHTML:false} (${suggestion.iata|startHighlight:entry|escapeForHTML:false})
            </td>
            <td style="text-align:right;color:#666666;padding-left:5px;">
                ${suggestion.countryName}
            </td>
        </tr>
    {/macro}
{/Template}