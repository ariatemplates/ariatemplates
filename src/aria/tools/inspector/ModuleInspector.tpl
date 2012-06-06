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