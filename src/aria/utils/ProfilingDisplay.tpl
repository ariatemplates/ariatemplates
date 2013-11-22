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

// Display for profile informations
{Template {
    $classpath:'aria.utils.ProfilingDisplay',
    $hasScript: true
}}

    {var leftShift = 300/}
    {var scale = 2/}
    {var showAllMsg = true/}
    {var timeBegin = 0/}
    {var verticalBarTime1 = -1/}
    {var verticalBarTime2 = -1/}
    {var marginLeft = 5/}

    {macro main()}
        <div style="background:#ACC2FF;border-bottom:solid 2px black;padding:5px;width:${Math.max(getLength(data._max,0)+leftShift+30, 500)}px;color:white">
            <span {on click close/} style="cursor:pointer; padding-left:5px">
                {@aria:Icon {            
                    icon : 'std:close',
                    tooltip: "Close profiling data"
                }/}
            </span>
            <span {on click zoomOut/} style="cursor:pointer; padding-left:5px">
                {@aria:Icon {            
                    icon : 'std:zoom_out',
                    tooltip: "Zoom out"
                }/}
            </span>
            <span {on click zoomIn/} style="cursor:pointer; padding-left:5px">
                {@aria:Icon {            
                    icon : 'std:zoom_in',
                    tooltip: "Zoom in"
                }/}
            </span>
            <span {on click toggleChecked/} style="cursor:pointer; padding-left:5px">
                {@aria:Icon {            
                    icon : 'std:validated',
                    tooltip: "Show all/only selected items"
                }/}
            </span>
            <span {on click resetTimeOrigin/} style="cursor:pointer; padding-left:5px">
                {@aria:Icon {            
                    icon : 'std:undo',
                    tooltip: "Reset time origin"
                }/}
            </span>
        </div>
        <div {on mousedown mouseDown/} style="position:relative;">
            {foreach cat in data} 
                {if cat_index!='_max'}
                    {if showAllMsg || cat['view:visible']}
                        <div style="width:${getLength(data._max,0)+leftShift+30}px;border-bottom:solid 1px grey;margin:${marginLeft}px 0 15px 5px">
                            <h2>{call displayCheckBox(cat)/} ${cat_index}</h2>    
                            {foreach msg in cat}
                                {if msg_index.indexOf('view:') != 0 && (showAllMsg || msg['view:visible']) && isTimeRangeListVisible(msg)}
                                    <div style="position:relative; height:14px; width:100%;border-top:dashed 1px #EEE;font-size:xx-small;">
                                        {call displayCheckBox(msg)/} ${msg_index} (${msg[0]}ms) 
                                        {for var i=1; i<msg.length;i++}
                                            {var log = msg[i]/}
                                            {if isTimeRangeVisible(log.start, log.length)}
                                                <div style="position:absolute;top:0;
                                                            overflow:hidden;
                                                            left:${getPosition(log.start)}px;
                                                            width:${getLength(log.length,log.start)}px;
                                                            height:14px;
                                                            background:#ACC2FF;
                                                            border-left:solid 1px black"
                                                    title="start: ${log.start}ms; length: ${log.length}ms; ${msg_index} (${cat_index})">${log.length}</div>
                                            {/if}
                                        {/for}
                                    </div>
                                {/if}
                            {/foreach}
                        </div>
                    {/if}
                {/if}
            {/foreach}
            {section {
                id: "verticalBars",
                macro: "displayVerticalBars"
            }/}
        </div>

    {/macro}
    
    {macro displayCheckBox(item)}
        {if showAllMsg}
            <span style="position:relative;top:-4px;vertical-align:middle;">
                {@aria:CheckBox {
                    bind: {
                        value: {
                            to: 'view:visible',
                            inside: item
                        }
                    }
                }/}
            </span>
        {/if}
    {/macro}
    
    {macro displayVerticalBars()}
        {var timeDiff=Math.abs(verticalBarTime1-verticalBarTime2)/}
        {if isTimeRangeVisible(verticalBarTime1, 0)}
            <div style="position:absolute;left:${getPosition(verticalBarTime1)+marginLeft}px;top:0px;width:1px;height:100%;background-color:#C0C0C0;" title="ctrl marker position: ${verticalBarTime1}ms; ${timeDiff}ms between markers">&nbsp;</div>
        {/if}
        {if isTimeRangeVisible(verticalBarTime2, 0)}
            <div style="position:absolute;left:${getPosition(verticalBarTime2)+marginLeft}px;top:0px;width:1px;height:100%;background-color:#C0C0C0;" title="shift marker position: ${verticalBarTime2}ms; ${timeDiff}ms between markers">&nbsp;</div>
        {/if}
    {/macro}

{/Template}
