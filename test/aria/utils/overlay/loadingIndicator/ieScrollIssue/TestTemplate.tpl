{Template {
    $classpath : "test.aria.utils.overlay.loadingIndicator.ieScrollIssue.TestTemplate"
}}

    {macro main()}
    <div {id "container" /} style="height:350px; width:400px; background-color:green; overflow:scroll">
        <div {id "mySpan" /} style="height: 200px; width: 200px; background-color: blue;" >to be updated</div>
        <div id="testDiv1" style="height:500px; width:50px; background-color:red" >
        </div>
    </div>

    {/macro}


{/Template}
