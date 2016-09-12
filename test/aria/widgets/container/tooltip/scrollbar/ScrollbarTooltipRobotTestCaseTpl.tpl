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
    $classpath : "test.aria.widgets.container.tooltip.scrollbar.ScrollbarTooltipTpl"
}}

    {macro main()}
        {call tooltipWidget("withScrollBar", true)/} <span {id "nothingHere"/}>(nothing here)</span> {call tooltipWidget("withoutScrollBar", false)/}
    {/macro}

    {macro tooltipWidget(tooltipId, scrollBar)}
        {@aria:Tooltip {
            id : tooltipId,
            macro : "tooltipContent",
            scrollBarY: scrollBar,
            showDelay : 12,
            maxWidth : 300,
            maxHeight : 200
        }/}

        {@aria:Div {
            tooltipId : tooltipId
        }}
            <span {id tooltipId + "TooltipArea"/} style="color: red">I have a tooltip (${tooltipId})</span>
        {/@aria:Div}
    {/macro}

    {macro tooltipContent()}
        <span {id "testMe"/}>This is the content of my very long tooltip which should span over multiple lines...
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tellus nisl, feugiat id laoreet vitae, ornare nec mauris. Sed arcu massa, congue eget fermentum id, porttitor non nibh. Aenean vel posuere lectus, eget ultricies purus. Quisque volutpat ipsum non urna congue, vitae laoreet ex eleifend. Donec vitae erat ac libero facilisis ultricies sit amet eu urna. Proin id dui laoreet, semper mauris eget, eleifend lorem. Nunc eu mi vitae enim lacinia aliquet laoreet nec erat. Aliquam elementum turpis placerat lacus faucibus sodales.
            Etiam at ipsum semper, pulvinar velit et, ultricies est. In venenatis nisi sit amet ligula iaculis, nec dictum velit faucibus. Nam fermentum elit diam, id faucibus enim tempus non. Vestibulum tristique tortor facilisis enim vestibulum suscipit eget porttitor orci. Phasellus eu nisi sit amet erat vehicula lobortis. Proin varius pretium augue, a iaculis magna fermentum sed. Integer ex ligula, mattis quis magna quis, molestie scelerisque augue. Nullam non sollicitudin est, in accumsan purus. Integer feugiat quam vitae erat lacinia, eget congue velit porta. Integer accumsan venenatis placerat. Suspendisse ut nisi vitae nisl laoreet facilisis quis a justo. Morbi ex tortor, vestibulum vel aliquet ultricies, placerat quis tellus. Sed blandit, felis vitae porta dignissim, diam risus congue orci, mattis porta lorem nibh facilisis nibh. Morbi aliquet feugiat est, in lacinia justo convallis nec.
            Etiam ac mollis diam, non bibendum tellus. Praesent eu tellus placerat, cursus libero condimentum, luctus felis. Nam nulla augue, iaculis vitae lacus sed, pulvinar elementum tortor. Aliquam dignissim, metus et mollis auctor, nulla dolor vestibulum eros, non ornare tortor sapien at ligula. Vivamus facilisis massa sit amet lectus pharetra vehicula. Suspendisse sit amet nisl id velit gravida vulputate sed a eros. Sed risus mauris, pretium id lacinia eu, volutpat id turpis. Maecenas vestibulum id turpis a vestibulum. Praesent lacus tortor, feugiat eu lobortis eget, iaculis vel risus. Nulla facilisi. Donec id tellus id libero dignissim eleifend a nec sem. Sed euismod volutpat nisi.
        </span>
    {/macro}
{/Template}
