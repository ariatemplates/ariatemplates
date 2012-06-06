// Content of the contextual menu for templates
{Template {
	$classpath:'aria.tools.contextual.ContextualDisplay',
	$hasScript:true
}}

	{macro main()}
		{@aria:Div {
			sclass : "dropdown"
		}}
			<div style="padding:5px;">
				<table cellpadding="0" cellspacing="5">
					<tr>
						<td align="right">Template:</td>
						<td><strong>${data.templateCtxt.tplClasspath}</strong></td>
					</tr>
					{if (data.templateCtxt.moduleCtrlPrivate)}
						<tr>
							<td align="right">Module Controller:</td>
							<td><strong>${data.templateCtxt.moduleCtrlPrivate.$classpath}</strong></td>
						</tr>
					{/if}
				</table>
				<div style="text-align:center; padding:5px; background:#F3F3F3; border:solid 1px #DDDDDD;">
					{@aria:Button {label:"Reload Template", onclick : "reloadTemplate"}/}
					{if aria.templates.ModuleCtrlFactory.isModuleCtrlReloadable(data.templateCtxt.moduleCtrlPrivate)}
						{@aria:Button {label:"Reload Module", onclick : "reloadModule"}/}
					{/if}
				 	{@aria:Button {label:"Debug Tools", onclick: "openDebug"}/}
				 </div>
			</div>

		{/@aria:Div}
	{/macro}
	

{/Template}