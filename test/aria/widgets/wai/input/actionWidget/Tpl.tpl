/*
 * Copyright 2016 Amadeus s.a.s.
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
	$classpath: 'test.aria.widgets.wai.input.actionWidget.Tpl',
	$hasScript: true,
	$css: ['test.aria.widgets.wai.input.actionWidget.CSS']
}}

{createView view on [] /}

{macro main()}
	{foreach widgetType inArray this.data.widgetsTypes}
		<hr/>

		<div class='content_container' id='${widgetType.elements.label.id}'>${widgetType.elements.label.content}</div>
		<div class='content_container' id='${widgetType.elements.description.id}'>${widgetType.elements.description.content}</div>

		<div class='user_focus' tabindex='0' id='${widgetType.elements.before.id}'>${widgetType.elements.before.content}</div>

		{foreach widget inArray widgetType.widgets}
			<p>
				{if widgetType.type === 'link'}
					{@aria:Link widget.configuration /}
				{elseif widgetType.type === 'button' /}
					{@aria:Button widget.configuration /}
				{elseif widgetType.type === 'icon_button' /}
					${widget.content} {@aria:IconButton widget.configuration /}
				{elseif widgetType.type === 'sort_indicator' /}
					{@aria:SortIndicator widget.configuration /}
				{/if}
			</p>
		{/foreach}

		<div class='user_focus' tabindex='0' id='${widgetType.elements.after.id}'>${widgetType.elements.after.content}</div>
	{/foreach}
{/macro}

{/Template}
