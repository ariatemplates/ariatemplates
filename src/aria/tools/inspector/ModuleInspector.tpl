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
// Dedicated display for module inspection
// aria.tools.inspector.ModuleInspector
{Template {
	$classpath : 'aria.tools.inspector.ModuleInspector',
	$hasScript : true,
	$width:{min:100}
}}

	{macro main()}
	
		{var localModuleCtrl = data.moduleCtrl/}
		
		<h3>${localModuleCtrl.$classpath}</h3>
		
		<div>
			{call displayControls()/}
		</div>
		
		<h4>General Information</h4>
		<ul>
			<li>Classpath: ${localModuleCtrl.$classpath}</li>
			{if (localModuleCtrl._dataBeanName)}
				<li>Data bean definition: ${localModuleCtrl._dataBeanName}</li>
			{/if}
			<li>Interface: ${localModuleCtrl.$publicInterfaceName}</li>
		</ul>
		<h4>Data</h4>
		{@aria:Template {
			defaultTemplate : "aria.tools.common.ObjectTreeDisplay",
			data: {
				content : localModuleCtrl.getData(),
				title : "data",
				showDepth : 2,
				search : true
			},
			width: $hdim(100,1)
		}/}
	{/macro}
	
	{macro displayControls()}
		{section "controls"}
			{if data.isReloadable}
				<div style="text-align:center; padding:5px; background:#F3F3F3; border:solid 1px #DDDDDD;">	
					{@aria:Button { label:"Reload", onclick : {fn:reloadModule}}/}
				</div>
			{/if}
		{/section}
	{/macro}

{/Template}