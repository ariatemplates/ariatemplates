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
	$classpath: 'test.aria.widgets.wai.processingIndicator.Tpl',
	$hasScript: true,
	$css: ['test.aria.widgets.wai.processingIndicator.CSS']
}}

{macro main()}
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////

	{@aria:Button {
		id: this.data.elements.toggleOverlay.id,
		label: this.data.elements.toggleOverlay.content,
		onclick: {
			fn: this.toggleOverlay,
			scope: this
		}
	}/}



	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////

	{call displayFocusableElement('before') /}

	{call displayContainerElement('previous') /}
	{call displayLoadingElement() /}
	{call displayContainerElement('next') /}

	{call displayFocusableElement('after') /}

{/macro}

{macro displayLoadingElement()}
	{if !this.data.section}
		{call _displayLoadingElement() /}
	{else /}
		{section {
			waiAria: true,
			macro: {
				name: '_displayLoadingElement',
				args: [true]
			},
			attributes: {classList: ['container']},

			id: this.data.elements.loading.id,
			bindProcessingTo: {
				inside: this.data.elements.loading,
				to: 'overlaySet'
			},
			processingLabel: this.data.elements.loading.message,

			waiAriaProcessingLabelReadInterval: this.data.readInterval,
			waiAriaProcessingLabelReadOnceFirst: this.data.readOnceFirst
		}/}
	{/if}
{/macro}

{macro _displayLoadingElement(noClass)}
	{call displayContainerElement('loading', noClass) /}
{/macro}



////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

{macro displayFocusableElement(elementKey)}
	<div
		class='user_focus'
		tabindex='0'
		id='${this.data.elements[elementKey].id}'
	>
		${this.data.elements[elementKey].content}
	</div>
{/macro}

{macro displayContainerElement(elementKey, noClass)}
	<div
		{if !noClass}
			class='container'
		{/if}
		{if this.data.elements[elementKey].id != null}
			{id this.data.elements[elementKey].id /}
		{/if}
	>
		<div tabindex='0'>
			${this.data.elements[elementKey].content}
		</div>
	</div>
{/macro}

{/Template}
