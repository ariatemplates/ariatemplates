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