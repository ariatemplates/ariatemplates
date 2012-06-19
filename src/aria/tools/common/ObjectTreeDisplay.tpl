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

// Display an object
{Template {
    $classpath:'aria.tools.common.ObjectTreeDisplay',
    $hasScript:true
}}

    {var typeUtils = aria.utils.Type/}

    {macro main()}    
        <table cellpadding="0" cellspacing="0">
            {call displayElement(data.content, data.title, 0)/}
        </table>
    {/macro}
    
    {macro displayElement(element, name, depth)}
    
    
        <tr>
            // first td -> name
            <td style="padding-left:${depth*20}px; padding-right:10px;">        
    
                {if (element && !element.$classpath && (typeUtils.isArray(element)||typeUtils.isObject(element)))}
                    {if (element["view:ariaDebug:showOpen"+depth])}
                        <span style="cursor:pointer;" {on click {fn:nodeClick, args:{element:element,depth:depth}}/}>{@aria:Icon {icon:"std:collapse"}/} {call displayName(name)/}</span>
                    {else/}
                        <span style="cursor:pointer;" {on click {fn:nodeClick, args:{element:element,depth:depth}}/}>{@aria:Icon {icon:"std:expand"}/} {call displayName(name)/}</span>
                    {/if}
                {else/}
                    <span style="padding-left:16px">&nbsp;{call displayName(name)/}</span> // span used to simulate icon space
                {/if}        
            </td>
            
            // second td -> content
            <td style="vertical-align: top;">
                {if (typeUtils.isArray(element))}
                    <span style="color:orange; cursor:pointer;" {on click {fn:nodeClick, args:{element:element,depth:depth}}/}>Array [${element.length}]</span>
                {elseif (typeUtils.isObject(element))/}
                    <span style="color:orange; cursor:pointer;" {on click {fn:nodeClick, args:{element:element,depth:depth}}/}>Object</span>
                {elseif (element === null)/}
                    <em>null</em>
                {elseif (typeof element == 'undefined')/}
                    <em>undefined</em>
                {elseif (typeUtils.isString(element))/}
                    <span style="color:red">"${element}"</span>
                {elseif (element === true)/}
                    <span style="color:purple">true</span>
                {elseif (element === false)/}
                    <span style="color:purple">false</span>
                {elseif (typeUtils.isNumber(element))/}
                    <span style="color:blue">${element}</span>
                {elseif (element.$classpath)/}
                    ${element.$classpath}
                {else/}
                    <span style="color:green">${typeof element}</span>
                {/if}    
            </td>
        </tr>
        {if (element && element["view:ariaDebug:showOpen"+depth])}
            {var types = filterTypes(element)/}
            {call displaySubElement(element, types.data, depth+1)/}
            {call displaySubElement(element, types.meta, depth+1)/}
        {/if}
                
    {/macro}
    
    {macro displaySubElement(element, types, depth)}
        {foreach key inArray types.booleans}
            {call displayElement(element[key], key, depth)/}
        {/foreach}
        {foreach key inArray types.strings}
            {call displayElement(element[key], key, depth)/}
        {/foreach}
        {foreach key inArray types.numbers}
            {call displayElement(element[key], key, depth)/}
        {/foreach}
        {foreach key inArray types.instances}
            {call displayElement(element[key], key, depth)/}
        {/foreach}
        {foreach key inArray types.others}
            {call displayElement(element[key], key, depth)/}
        {/foreach}        
        {foreach key inArray types.arrays}
            {call displayElement(element[key], key, depth)/}
        {/foreach}
        {foreach key inArray types.objects}
            {call displayElement(element[key], key, depth)/}
        {/foreach}
    {/macro}
    
    // special greyed display for meta element
    {macro displayName(name)}
        {if (name.indexOf(":")!=-1)}
            <span style="color:grey">${name}</span>
        {else/}
            ${name}
        {/if}
    {/macro}

{/Template}