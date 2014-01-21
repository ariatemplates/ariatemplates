{Template {
	$classpath : "test.aria.utils.overlay.loadingIndicator.scrollableBody.TestTemplate"
}}

	{macro main()}
		<div id="container" style="height:5000px; width: 3000px;">

			<div style="height: 2000px">
				fake div
			</div>
			<span id="needLoader" style="margin-left: 150px; background: blue; display: inline-block; height: 200px; width: 300px;">this span needs a loading indicator</span>
		</div>

	{/macro}


{/Template}