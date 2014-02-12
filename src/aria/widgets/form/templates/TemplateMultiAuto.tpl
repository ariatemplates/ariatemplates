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
    $classpath:'aria.widgets.form.templates.TemplateMultiAuto',
    $extends :"aria.widgets.form.templates.TemplateMultiSelect"

}}
    {macro main()}
        // The Div is used to wrap the items with good looking border.
        {@aria:Div data.cfg}
                {section {id: 'Items', macro: 'renderList'} /}
                {call footer()/}

        {/@aria:Div}
    {/macro}
    {macro renderCheckboxLabel(item)}
    	{if (item.value.label)}
            {set checkboxLabel = item.value.label/}
        {/if}
        {if (data.displayOptions.tableMode == true)}
            {set checkboxLabel = ""/}
        {/if}
    {/macro}
    {/Template}
