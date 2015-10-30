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
    $classpath:'aria.widgets.form.templates.TemplateMultiSelect',
    $hasScript:true,
    $res:{
      footerRes : 'aria.resources.multiselect.FooterRes'
    }
}}
    {macro main()}
        {var checkboxLabel = "Error"/}
        // The Div is used to wrap the items with good looking border.
        {@aria:Div data.cfg}
                {section {id: 'Items', macro: 'renderList'} /}
                {if (data.displayOptions.displayFooter)}
                    {call footer()/}
                {/if}
        {/@aria:Div}

    {/macro}

    {macro renderList(item)}
        {if (data.displayOptions.flowOrientation == 'horizontal')}
            // with columns, horizontal
            <table>
            {foreach item inView data.itemsView}
                {if item_index % data.numberOfColumns == 0}
                    <tr>
                {/if}

                <td>{call renderItem(item, item_info.initIndex)/}</td>
                {if (data.displayOptions.tableMode == true)}
                    {var checkboxLabelSplit = item.label.split('|')/}
                    <td {on click {fn: "itemTableClick", args: {    item : item, itemIdx : item.index }}/}>${checkboxLabelSplit[0]|escapeForHTML:{text: true}}</td>
                    <td {on click {fn: "itemTableClick", args: {    item : item, itemIdx : item.index }}/}>${checkboxLabelSplit[1]|escapeForHTML:{text: true}}</td>
                    <td {on click {fn: "itemTableClick", args: {    item : item, itemIdx : item.index }}/}>${checkboxLabelSplit[2]|escapeForHTML:{text: true}}</td>
                    <td {on click {fn: "itemTableClick", args: {    item : item, itemIdx : item.index }}/}>${checkboxLabelSplit[3]|escapeForHTML:{text: true}}</td>
                {/if}

                {if (item_index + 1) % data.numberOfColumns == 0}
                    </tr>
                {/if}
            {/foreach}
            </table>
        {elseif (data.displayOptions.flowOrientation == 'vertical')/}
            {var lineCount = data.numberOfRows /}
            {var columnCount = data.numberOfColumns /}
            {var outputCount = 0 /}
            {var outputRows = 1 /}
            <table>
            {for var i = 0 ; i < lineCount ; i++}
                <tr>
                {var lastColCount = 0 /}
                {for var j = 0 ; j < columnCount ; j++ }
                    <td>
                    {var itemIndex = (j*lineCount)+i/}
                    {if (itemIndex < data.itemsView.items.length)}
                        {var item = data.itemsView.items[itemIndex].value/}
                        {call renderItem(item, itemIndex)/}
                    {/if}
                    {set outputCount = outputCount + 1/}
                    </td>
                {/for}
                {set outputRows = outputRows + 1/}
                </tr>
            {/for}
            </table>
        {else/}
            {foreach item inView data.itemsView}
                {call renderItem(item, item_info.initIndex)/}
            {/foreach}
        {/if}
    {/macro}

    {macro renderItem(item)}
        {call renderCheckboxLabel(item)/}
        {@aria:CheckBox {
            label: checkboxLabel,
            waiAria: data.waiAria,
            waiLabelHidden: true,
            waiLabel: checkboxLabel,
            onchange: {
                fn: "itemClick",
                args: {
                    item : item,
                    itemIdx : item.index
                }
            },
            id: 'listItem' + item.index,
            bind:{
                "value": {
                    inside: item, to: 'selected'
                },
                "disabled" : {
                    inside : item, to: "currentlyDisabled"
                    }
            },
            value: item.selected
        }/}

    {/macro}

    {macro renderCheckboxLabel(item)}
        {if (data.displayOptions.listDisplay == 'code')}
            {set checkboxLabel = item.value/}
        {elseif (data.displayOptions.listDisplay == 'label')/}
            {set checkboxLabel = item.label/}
        {elseif (data.displayOptions.listDisplay == 'both')/}
            {set checkboxLabel = item.label + " (" + item.value + ") " /}
        {/if}
        {if (data.displayOptions.tableMode == true)}
            {set checkboxLabel = ""/}
        {/if}
    {/macro}

    {macro footer()}
        <div class="${data.skin.cssClassFooter}">
            <div style="width:120px">
                {@aria:Link {
                    label : footerRes.selectAll,
                    sclass : 'multiSelectFooter',
                    onclick : {
                        fn : "selectAll",
                        scope : moduleCtrl
                    }
                }/}
            </div>
            <span style="position:absolute;right:2px;text-align:right;">
                {@aria:Link {
                    label:footerRes.close,
                    sclass : 'multiSelectFooter',
                    onclick: {
                        fn: "close",
                        scope: moduleCtrl
                    }
                }/}
            </span>
            <span>
                {@aria:Link {
                    label:footerRes.deselectAll,
                    sclass : 'multiSelectFooter',
                    onclick: {
                        fn: "deselectAll",
                        scope: moduleCtrl
                    }
                }/}
            </span>
        </div>
    {/macro}

{/Template}
