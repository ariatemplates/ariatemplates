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
    $classpath: "test.aria.widgets.action.sortindicator.onclick.OnclickCallbackTestCaseTpl",
    $hasScript: true,
    $dependencies : ["aria.utils.String"],
    $res:{
        res: "test.aria.widgets.action.sortindicator.onclick.samples.Resources"
    }
}}

{var label = res.airshopper.search.label/}
    {macro main()}
        <div id="allFaresRecommendations">
            {call displayBounds()/}
        </div>
    {/macro}

    {macro displayBounds()}
        {var labels=res.airshopper.avail.label/}
        {foreach price in data.avail.prices}
            {call displayBound (price_index,0)/}
        {/foreach}
    {/macro}

    {macro displayBound(priceIndex, boundIndex)}

    	{section {
    	    id : "bound" + boundIndex,
    	    macro : {
    	        name : "displayBoundContent",
    	        args : [priceIndex, boundIndex]
    	    }
    	}/}
    	<br/>

    {/macro}

    {macro displayBoundContent(priceIndex, boundIndex)}

            {var bound=data.avail.prices[priceIndex].bounds[boundIndex]/}
            {var selection=getSelection(boundIndex)/}

            {if (bound.errors && bound.errors.length > 0)}
                {call displayErrors(bound.errors)/}
            {/if}

            {if (bound.recommendations && bound.recommendations.length > 0)}
                {var labels=res.airshopper.avail.label/}
                {createView recommendationsView[boundIndex] on bound.recommendations/}

                // bound table
                <div class="uicTable uicBorder" style="width:650px" {on click {fn:"onTableClick", args:boundIndex}/}>
                    <table cellspacing="0" cellpadding="0" style="table-layout: fixed;width:650px;">
                        <thead>
                            <tr class="uicPaletteDark">
                                <th class="id">&nbsp;</th>

                                <th class="fn" style="width:80px;">
                                    {@aria:SortIndicator {
                                        sortName:'SortByFlightNumber',
                                        label:labels.flight + ' is the full flight number title header',
                                        view:recommendationsView[boundIndex],
                                        sortKeyGetter:function(o) {
                                            return o.value.segments[0].airline + aria.utils.String.pad(o.value.segments[0].flightNumber, 8, 0, true);
                                        },
                                        labelWidth : 70,
                                        id : 'SortIndicatorId'+boundIndex,
                                        refreshArgs:[{section:"bound"+boundIndex}],
                                        activateEllipsis:true,
                                        ellipsis: '...',
                                        ellipsisLocation: 'right',
                                        onclick: {
                                            fn: "onClickCb"
                                        }
                                    }/}
                                </th>
                                <th class="cls">${labels.bkgClass}</th>
                                <th class="depCity">
                                    From
                                </th>
                                <th class="arrCity">
                                    {@aria:Link {
                                            label:labels.arrCity,
                                            onclick:{fn:"toggleSort",args:{view: recommendationsView[boundIndex], sort:"SortByArrCity"}}
                                    } /}
                                </th>
                                <th class="depTime">
                                    {@aria:Link {
                                            label:labels.depTime,
                                            onclick:{fn:"toggleSort",args:{view: recommendationsView[boundIndex], sort:"SortByDepTime"}}
                                    } /}
                                </th>
                                <th class="arrTime">
                                    {@aria:Link {
                                            label:labels.arrTime,
                                            onclick:{fn:"toggleSort",args:{view: recommendationsView[boundIndex], sort:"SortByArrTime"}}
                                    } /}
                                <th class="stp">
                                    {@aria:Link {
                                            label:labels.stops,
                                            onclick:{fn:"toggleSort",args:{view: recommendationsView[boundIndex], sort:"SortByStops"}}
                                    } /}
                                </th>
                                <th class="dur">
                                    {@aria:Link {
                                            label:labels.duration,
                                            onclick:{fn:"toggleSort",args:{view: recommendationsView[boundIndex], sort:"SortByDuration"}}
                                    } /}
                                </th>
                                <th class="eqmt">
                                    {@aria:SortIndicator {
                                        sortName:'SortByAirport',
                                        label:labels.aircraft,
                                        view:recommendationsView[boundIndex],
                                        sortKeyGetter:function(o) {
                                            return o.value.segments[0].equipment;
                                        },
                                        refreshArgs:[{section:"bound"+boundIndex}],
                                        activateEllipsis:false,
                                        ellipsis: '...',
                                        ellipsisLocation: 'right'
                                    }/}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach recommendation inSortedView recommendationsView[boundIndex]}
                                {call displayRecommendation(recommendation, recommendation_index, selection, boundIndex)/}
                            {/foreach}
                        </tbody>
                    </table>
                </div>
            {/if}

    {/macro}
    {macro displayRecommendation(recommendation, index, selection, boundIndex)}
        {var dictionary = data.avail.dictionary/}
        {var nbSegments=recommendation.segments.length/}

        {foreach segment in recommendation.segments}
            <tr {on click {fn:"selectRecommendation", args: {combinationID:index, recommID:index, boundID:boundIndex}}/} class="" data-recommendation="${index}" data-segment="${segment_index}">
                // index
                {if segment_index == 0}
                    <td class="id" rowspan=${nbSegments}>
                        ${recommendation.index + 1}.
                    </td>
                {/if}
                <td class="fn">
                    {@aria:Link {
                        label: getFlightNumber(segment),
                        tooltip:getAirlineTooltip(segment)
                    } /}
                </td>
                <td class="cls">
                    {foreach cls in segment.classes}
                        {separator} {/separator}
                        ${cls.rbd}${cls.status}
                    {/foreach}
                </td>
                <td class="depCity">
                    <span class="hasTooltip">${segment.departure.location} ${segment.departure.terminal}</span>
                </td>
                <td class="arrCity">
                    <span class="hasTooltip">${segment.arrival.location} ${segment.arrival.terminal}</span>
                </td>
                <td class="depTime">
                    {var datetoFormat = segment.departure.date /}
                    {var depDate = new Date(datetoFormat.year, datetoFormat.month, datetoFormat.date, datetoFormat.hours, datetoFormat.minutes, datetoFormat.seconds) /}
                    ${depDate|dateformat:"hh:mm"}
                </td>
                <td class="arrTime">
                    {var datetoFormat = segment.arrival.date /}
                    {var arrDate = new Date(datetoFormat.year, datetoFormat.month, datetoFormat.date, datetoFormat.hours, datetoFormat.minutes, datetoFormat.seconds) /}
                    ${arrDate|dateformat:"hh:mm"}
                    {if !(aria.utils.Date.isSameDay(arrDate, depDate))}
                        ${getDayDelta(arrDate, depDate)}
                    {/if}
                </td>
                <td class="stp">
                    ${segment.stops}
                </td>
                {if segment_index == 0}
                    <td class="dur" rowspan=${nbSegments}>
                        ${recommendation.duration}
                    </td>
                {/if}
                <td class="eqmt">
                    <span class="hasTooltip" title="${segment.equipment} ${data.avail.dictionary.equipments[segment.equipment]}">${segment.equipment}</span>
                </td>
            </tr>
        {/foreach}
    {/macro}

    {macro displayErrors(errors)}
        {foreach error in errors}
            {separator}<BR>{/separator}
            ${error.text}
        {/foreach}
    {/macro}

{/Template}
