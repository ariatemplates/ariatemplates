// Dedicated display for template inspection
// aria.tools.inspector.TemplateInspector
{Template {
	$classpath : 'aria.tools.inspector.TemplateInspector',	
	$hasScript : true,
	$width:{min:100}
}}

	{macro main()}
	
		<h3>${data.templateCtxt.tplClasspath}</h3>

		<div>
			{call displayControls()/}
		</div>
		
		<h4>General Information</h4>
		
		{if (data.showSource)}
			<p {on click {fn:toggleSource}/} style="cursor:pointer;">{@aria:Icon {icon:"std:collapse" }/} Source code</p>
			<textarea id='aria.tools.inspector.TemplateInspector_Src' style='width:${$hdim(96,1)}px;font-family: "courier New", courier, monospace; height:250px;' {on keyup {fn:this.editSource}/}>
				${data.source|escape}
			</textarea>
		{else/}
			<p {on click {fn:toggleSource}/} style="cursor:pointer;">{@aria:Icon {icon:"std:expand" }/} Source code</p>
		{/if}
		
		<h4>Widgets</h4>
		
		{section "widgets"}	
			{if (data.selectedWidget)}
				<div style="border: solid 1px #DDDDDD;padding:5px;width:${$hdim(88,1)}px;overflow:auto;">
				{@aria:Template {
					defaultTemplate : "aria.tools.common.ObjectTreeDisplay",
					data: {
						content : data.selectedWidget.widget._cfg,
						title : "Configuration",
						showDepth : 2,
						search : true
					}
				}/}
				</div>
			{else/}
				<em style="color:lightGrey">Click to display configuration details</em>
			{/if}
			{call displayWidgets(data.widgets)/}
		{/section}
		
	{/macro}
	
	{macro displayWidgets(container)}
		<ul>
		{foreach widgetDesc inArray container}
			<li {on mouseover {fn:widgetMouseOver, args:widgetDesc}/}
				{on mouseout {fn:widgetMouseOut}/}>
				<span {on click {fn:displayWidgetDetails, args:widgetDesc}/}>
					{if (data.selectedWidget==widgetDesc)}<strong>{/if}
						${widgetDesc.widget.$classpath}
					{if (data.selectedWidget==widgetDesc)}</strong>{/if}
				</span>
				{if (widgetDesc.content)}
					{call displayWidgets(widgetDesc.content)/}
				{/if}
			</li> 
		{/foreach}
		</ul>
	{/macro}
	
	{macro displayControls()}
		{section "controls"}	
			<div style="text-align:center; padding:5px; background:#F3F3F3; border:solid 1px #DDDDDD;">
				{@aria:Button { label:"Reload", onclick : {fn:reloadTemplate}}/}
				{@aria:Button { label:"Refresh", onclick : {fn:refreshTemplate}}/}
				{if (data.showSource && !data.initialSource)}
					{@aria:Button { label:"Reload with Source", onclick : {fn:reloadTemplateWithSrc}}/}
					</div>
					<div style="text-align:center;color:red;">{@aria:Icon {icon:"std:warning"}/} &nbsp;&nbsp; Changes done here ARE NOT PERSISTENT. Use for testing only.
				{/if}
			</div>
		{/section}
	{/macro}
{/Template}