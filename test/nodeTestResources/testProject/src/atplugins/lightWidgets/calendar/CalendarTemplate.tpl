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

{Template {
    $classpath: "atplugins.lightWidgets.calendar.CalendarTemplate",
    $hasScript: true,
    $res: {
        res:"aria.resources.CalendarRes"
    }
}}

    {var calendar=data.dataModel.calendar/}
    {var settings=data.dataModel.settings/}
    {var skin=data.dataModel.skin/}

    {macro main()}


        {if settings.displayUnit == "M"}
              {call renderCalendar()/}
        {/if}
    {/macro}

    {macro renderCalendar()}
        {if settings.label}
            <div class="${skin.baseCSS}label">${settings.label}</div>
        {/if}
        {for var startIndex = calendar.startMonthIndex, endIndex = calendar.endMonthIndex, index = startIndex ; index <= endIndex ; index++}
            <span style="display: inline-block; vertical-align: top; margin: 2px;">
                {call renderMonth(calendar.months[index],index == startIndex, index == endIndex)/}
            </span>
        {/for}
        {if settings.showShortcuts}
            <div style="text-align: center; margin: 1px;">
                <a title="${calendar.today|dateformat:settings.completeDateLabelFormat}" tabIndex="-1" href="javascript:;" {on click {fn: "navigate", scope: data.controller, args: {date:calendar.today}}/}>${res.today}</a>
                {section {
                    id : "selectedDay",
                    macro : "selectedDay"
                } /}
            </div>
        {/if}
    {/macro}

    {macro selectedDay()}
        {if settings.value}
            &nbsp;|&nbsp; <a title="${settings.value|dateformat:settings.completeDateLabelFormat}" tabIndex="-1" href="javascript:;" {on click {fn: "navigate", scope: data.controller, args: {date:settings.value}}/}>${res.selectedDate}</a>
        {/if}
    {/macro}

    {macro renderMonth(month,first,last)}
        <table class="${skin.baseCSS}month" cellspacing="0" style="width: ${settings.showWeekNumbers?138:128}px;">
            <thead>
                <tr>
                    <th colspan="8">
                        <div class="${skin.baseCSS}monthTitle" style="position: relative;">
                            {if first && (calendar.previousPageEnabled || !settings.restrainedNavigation)}
                                <div class="previousMonth" style="position: absolute; left: 0px; top: -2px; cursor: pointer;" {on click {fn: "navigate", args : { increment: -1, incrementUnit: "M" }, scope : data.controller}/}>&nbsp;</div>
                            {/if}
                            {if last && (calendar.nextPageEnabled || !settings.restrainedNavigation)}
                                <div class="nextMonth" style="position: absolute; right: 0px; top: -2px; cursor: pointer;" {on click {fn: "navigate", args : { increment: 1, incrementUnit: "M" }, scope : data.controller}/}>&nbsp;</div>
                            {/if}
                            ${month.label}
                        </div>
                    </th>
                </tr>
                <tr>
                    {if settings.showWeekNumbers}<th  class="${skin.baseCSS}weekNumber">&nbsp;</th>{/if}
                    {foreach day inArray calendar.daysOfWeek}
                        <th class="${skin.baseCSS}weekDaysLabel">${day.label}</th>
                    {/foreach}
                </tr>
            </thead>
            <tbody {on click clickDay/} {on mouseover mouseOverDay/} {on mouseout mouseOutDay/} {id "month_"+month.monthKey/}>
                {var nbweeks=0/}
                {foreach week inArray month.weeks}
                    {set nbweeks+=1/}
                    <tr>
                        {if settings.showWeekNumbers}<td class="${skin.baseCSS}weekNumber">{if week.overlappingDays == 0 || week.monthEnd == month.monthKey}${week.weekNumber}{else/}&nbsp;{/if}</td>{/if}
                        {foreach day inArray week.days}
                            {call renderDay(day,month)/}
                        {/foreach}
                    </tr>
                {/foreach}
                {for ;nbweeks<=5;nbweeks++}
                    <tr>
                        {if settings.showWeekNumbers}<td class="${skin.baseCSS}weekNumber" style="visibility: hidden;">&nbsp;</td>{/if}
                        <td class="${skin.baseCSS}day" colspan="7" style="visibility: hidden;">&nbsp;</td>
                    </tr>
                {/for}
            </tbody>
        </table>
    {/macro}

    {macro renderDay(day, month)}
        {var jsDate=day.jsDate/}
        {if day.monthKey==month.monthKey}
            <td ${day.isSelectable ? "data-date=\""+jsDate.getTime()+"\"":""}
                class="${getClassForDay(day)}"
            >${day.label}</td>
        {else/}
            <td />
        {/if}
    {/macro}
{/Template}