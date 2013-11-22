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
	$classpath:'test.aria.templates.issue348.animation.Animation',
	$hasScript: true,
	$css: ['test.aria.templates.issue348.animation.AnimationCSS']
}}
	{macro main()}
			<div class="animation" {on animationiteration {
            fn: this.animationIterationHandler,
            scope: this
        } /}  {on animationstart {
            fn: this.animationStartHandler,
            scope: this
        } /}
		{on animationend {
            fn: this.animationEndHandler,
            scope: this
        } /}>Animation</div>
		
		 <div id="scoreTime" class="largeText">
        Animation Iteration:  {@aria:NumberField {bind:{value:{to:"iteration",inside:data}}}/}
		 <p>
			{@aria:TextField {
				label: "start",
				labelPos: "left",
				width: 280,
				block: true,
				labelWidth: 100,
				bind: {
					"value": {
						inside:data, to:'startTxt'
					}
				}
			}/}
			
		 </p>
		 <p><p>
			{@aria:TextField {
				label: "end",
				labelPos: "left",
				width: 280,
				block: true,
				labelWidth: 100,
				bind: {
					"value": {
						inside:data, to:'endTxt'
					}
				}
			}/}
			
		 </p></p>
    </div>
	{/macro}

{/Template}
