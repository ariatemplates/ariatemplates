{Template {
	$classpath : "test.aria.widgets.form.issue411.MultiSelect",
	$width : { min : 500 }
	} }
	
	{macro main ( )}
		{@aria:MultiSelect {
			id : "ms",
			width : 200,
			block: true,
			items : data.options,
			popupOpen : true,
			bind: {
				popupOpen : {
					to:"popupopenMS",
					inside:data
				}	
			}
		}/}
	{/macro}

{/Template}
