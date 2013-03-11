{Template {
	$classpath : "test.aria.widgets.form.issue411.DatePicker",
	$width : { min : 500 }
	} }
	
	{macro main ( )}
	{var minDate = new Date()/}
	{var maxDate = new Date(minDate.getFullYear()+1,minDate.getMonth(),minDate.getDate())/}
        {@aria:DatePicker {
	        id: "dp",	
			labelPos: "left",
			labelAlign:"right",
			minValue: minDate,
			maxValue: maxDate,
			popupOpen : true,
			bind:{
			  	popupOpen : {
						to : "popupOpenDP",
						inside : data
					}
			}
	}/}	
	{/macro}

{/Template}
