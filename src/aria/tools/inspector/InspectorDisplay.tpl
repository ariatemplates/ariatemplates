// Template to display highlighting informations in subwindow
// aria.tools.inspector.InspectorDisplay
{Template {
	$classpath : 'aria.tools.inspector.InspectorDisplay',
	$hasScript : true,
	$width:{min:800}
}}

	{macro main()}
	
		{@aria:Dialog {
			contentMacro : "showLock",
			modal : true,
			closable : false,
			bind : {
				visible : {
					to : "locked",
					inside : data
				}
			}
		}}
		{/@aria:Dialog}
	
		<div style="float:left;width:${$hdim(380,0.5)}px;margin:5px;">
			<h2 style="color:#99CC00;margin-bottom:0px;">Templates</h2>
			<div style="border:solid 1px #888;padding:5px;width:${$hdim(368,0.5)}px;overflow:auto;">
				// display templates
				<em style="color:lightGrey">List of templates displayed in the application. Mouse over to highlight and show associated module, click to display details.</em>	
				{call displayTemplates(data.templates)/}
			</div>
			
			{if (data.selectedTemplate)}
				<div  style="border:solid 1px #888;padding:5px;margin-top:5px;">
					{@aria:Template {
						defaultTemplate : "aria.tools.inspector.TemplateInspector",
						data : data.selectedTemplate,
						width: $hdim(368,0.5)
					}/}
				</div>	
			{/if}
			
		</div>
		
		<div style="float:left;width:${$hdim(380,0.5)}px; margin:5px;overflow:auto;">
			<h2 style="color:#CC0099;margin-bottom:0px;">Module Controllers & Data</h2>
			<div  style="border:solid 1px #888;padding:5px;width:${$hdim(368,0.5)}px;overflow:auto;">
				// display modules
				<em style="color:lightGrey">List of module controllers associated to templates in the application. Mouse over to highlight associated template, click to display details.</em>
				{call displayModules(data.modules)/}
			</div>
		
			{if (data.selectedModule)}
				<div  style="border:solid 1px #888;padding:5px;margin-top:5px;">
					{@aria:Template {
						defaultTemplate : "aria.tools.inspector.ModuleInspector",
						data : this.data.selectedModule,
						width: $hdim(368,0.5)
					}/}
				</div>
			{/if}	

		</div>
			
	{/macro}
	
	{macro showLock()}
		<div style="padding:10px">
			{@aria:Icon {icon:"std:warning"}/} Operation in progress ...
		</div>
	{/macro}
	
	{macro displayTemplates(templates)}
		{section "templates"}
			{call recDisplayTemplates(templates)/}
		{/section}
	{/macro}
	
	{macro recDisplayTemplates(templates)}
			<ul>
			{for var i=0;i<templates.length;i++}
				{var template = templates[i]/}
				{var templateCtxt = template.templateCtxt/}
				<li {on mouseover {fn:tplMouseOver, args:template}/}
					{on mouseout {fn:tplMouseOut}/}
					{on click {fn:selectTemplate, args:template}/}
					{if (data.overTemplates && aria.utils.Array.contains(data.overTemplates, templateCtxt))}style='background:#DDDDDD;'{/if}>
					{if (data.selectedTemplate && data.selectedTemplate.templateCtxt == templateCtxt)}<strong>{/if}
						${templateCtxt.tplClasspath}
					{if (data.selectedTemplate && data.selectedTemplate.templateCtxt == templateCtxt)}</strong>{/if}
				{if (template.content.length>0)}
					{call recDisplayTemplates(template.content)/}	
				{/if}
				</li>
			{/for}
			</ul>
	{/macro}
	
	{macro displayModules(modules)}
		{section "modules"}
			<ul>
			{for var i=0;i<modules.length;i++}
				{var module = modules[i]/}
				<li {on mouseover {fn:moduleMouseOver, args:module}/}
					{on mouseout {fn:moduleMouseOut}/}
					{on click {fn:selectModule, args:module}/}
					{if (module.moduleCtrl == data.overModuleCtrl)}style='background:#DDDDDD;'{/if} />
					{if (data.selectedModule && data.selectedModule.moduleCtrl == module.moduleCtrl)}<strong>{/if}
						${module.moduleCtrl.$classpath}
					{if (data.selectedModule && data.selectedModule.moduleCtrl == module.moduleCtrl)}</strong>{/if}
				</li>
			{/for}
			</ul>
		{/section}
	{/macro}
	
{/Template}