/**
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
	$classpath:'aria.widgets.form.list.templates.ListTemplate',
	$hasScript:true
}}
	{macro main()}
		// The Div is used to wrap the items with good looking border.
		{@aria:Div data.cfg}
				
				{section 'Items'}
				<div {id "myList" /}
					{if !data.disabled}
						{on mouseup {fn: "itemClick"} /}
						{on mouseover {fn: "itemMouseOver"} /}
					{/if} 
				>
					<a href="#" style="display: none;">&nbsp;</a> //IE6 does not highlight the 1 elm in list
					{foreach item inArray data.items}
						{call renderItem(item, item_index)/}
					{/foreach}
				</div>
				{/section}
		{/@aria:Div}
	{/macro}	
	
	{macro renderItem(item, itemIdx)}
		{var a = _getClassForItem(item)/}
	
		<a href="#" class="${a}" _itemIdx="${itemIdx}" onclick="return false;">
			{if ! item.label}
				&nbsp;
			{else/}
				${item.label|escape}
			{/if}
		</a>
	{/macro}
	
{/Template}
