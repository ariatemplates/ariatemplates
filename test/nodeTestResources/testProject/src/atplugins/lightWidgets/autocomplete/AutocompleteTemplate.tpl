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
	$classpath: "atplugins.lightWidgets.autocomplete.AutocompleteTemplate",
	$hasScript: true
}}
	{var itemIndex = 0/}

	{macro main()}
		<div class="autocomplete_container" id="autocomplete_container">
			{section {
				id : "Items",
				macro : "renderItemsList"
			} /}
		</div>
	{/macro}

	{macro renderItemsList()}
		{var items = [data.items]/}
		<table
			{on mouseup {fn: "itemClick"} /}
			{on mouseover {fn: "itemMouseOver"} /}
			cellpadding="0" cellspacing="0"
		>
			<tbody {id "suggestionsRows" /} >
				{set itemIndex = 0/}
				{for var key in items}
					{call renderGroup(key, items[key])/}
				{/for}
			</tbody>
		</table>
	{/macro}

	{macro renderGroup(key, items)}
		{for var x = 0, l = items.length; x < l; x++}
			{var key = (x === 0 && key)/}
			{var item = items[x]/}
			{call renderItem(item, key)/}
		{/for}
	{/macro}

	{macro renderItem(item, key)}
		<tr {id "itemIdx" + itemIndex/} class="${_getClassForItem(itemIndex)}" >
			<td>
				<div class="item" data-itemIdx="${itemIndex}">${item.label}</div>
			</td>
		</tr>
		{set itemIndex = itemIndex + 1 /}
	{/macro}

{/Template}
