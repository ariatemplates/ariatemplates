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
// Main display for tools
// @class aria.tools.ToolsDisplay
{Template {
	$classpath : 'aria.tools.ToolsDisplay',
	$hasScript : true,
	$width:{min:800}
}}

	{macro main()}

		// display tools list
		
		<div style="width:${$hdim(790,1)}px; padding:5px 5px 0px 5px; background:#444444;">
			{foreach view inArray moduleCtrl.subModulesList}
				{var refpath = view.refpath/}
				{if (moduleCtrl[refpath])}
					<span style="cursor:pointer; display:inline-block; font-weight:bold; padding:2px 5px; border-left:solid 1px black; border-right:solid 1px black; border-top:solid 1px black;
						{if (view["view:selected"])}
							background:white; color:black; border-bottom:solid 1px white;
						{else/}
							background:grey; color:white; border-bottom:solid 1px #444444;
						{/if}
					" {on click {fn:selectTab, args:refpath}/}>${refpath|capitalize}</span>
				{/if}
			{/foreach}
		</div>

		{foreach view inArray moduleCtrl.subModulesList}
			{var refpath = view.refpath/}
			{if (view["view:selected"] && moduleCtrl[refpath])}
				{@aria:Template {
					defaultTemplate:view.display,
					moduleCtrl:moduleCtrl[refpath],
					width:$hdim(800,1)				
				}/}
			{/if}
		{/foreach}
		
	{/macro}
	

{/Template}