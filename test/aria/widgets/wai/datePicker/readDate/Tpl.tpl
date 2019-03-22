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
	$classpath: 'test.aria.widgets.wai.datePicker.readDate.Tpl',
	$hasScript: true,
	$css: ['test.aria.widgets.wai.datePicker.readDate.CSS']
}}

{macro main()}
	<div class='user_focus' tabindex='0' {id data.elements.before.id/}>${this.data.elements.before.content}</div>

	<div>
		{foreach widget inArray this.data.widgets}
			{@aria:DatePicker widget /}
		{/foreach}
	</div>
{/macro}

{/Template}
