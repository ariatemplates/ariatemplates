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
	$classpath: 'test.aria.utils.domNavigationManager.Tpl',
	$hasScript: true,
	$css: ['test.aria.utils.domNavigationManager.CSS']
}}

{macro main()}
	<div class='user_focus' tabindex='0' id='${this.data.elements.before.id}'>${this.data.elements.before.content}</div>

	{call buildElement(this.data.elementsTree) /}
{/macro}

{macro buildElement(node)}
	<div {id node.name /} class='node'>
		<span class='node_name' tabindex='0'>${node.name}</span>

		{foreach child inArray (node.children || [])}
			{call buildElement(child) /}
		{/foreach}
	</div>
{/macro}

{/Template}
