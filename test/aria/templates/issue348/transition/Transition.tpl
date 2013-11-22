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
	$classpath:'test.aria.templates.issue348.transition.Transition',
	$hasScript: true,
	$css: ['test.aria.templates.issue348.transition.TransitionCSS']

}}


	{macro main()}
		{call sectionBinding()/}

	{/macro}


	
	{macro sectionBinding()}
	 <div id="scoreTime" class="largeText">
        Transition: {@aria:NumberField {bind:{value:{to:"transition",inside:data}}}/}
    </div>
			<div class="title" id="title"  {on transitionend {
            fn: this.transitionEndHandler,
            scope: this
        } /}>Transition</div>
		
		
			{/macro}

{/Template}
