{Template {
	$classpath : "test.aria.widgets.form.issue411.SelectBox",
	$width : { min : 500 }
	} }
	
	{macro main ( )}
		{@aria:SelectBox {
			id: "sb",
			width: 200,
			block: true,
			options : data.options,
			popupOpen : true,
			bind: {
				popupOpen : {
					to:"popupopenSB",
					inside:data
				}	
			} }/}
	{/macro}

{/Template}
