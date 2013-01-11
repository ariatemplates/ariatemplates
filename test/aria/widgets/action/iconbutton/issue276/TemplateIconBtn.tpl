{Template {
	$classpath:'test.aria.widgets.action.iconbutton.issue276.TemplateIconBtn',
	$hasScript:false
}}

	{macro main()}

		{@aria:IconButton {
			id:"myid",
			sourceImage:{ path:aria.core.DownloadMgr.resolveURL("test/aria/widgets/action/iconbutton/issue276/icon-check.png"), width:42},
			label:"mybutton"
		} /}
		<br/>
		<br/>


	{/macro}

{/Template}
