{Template {
    $classpath : "test.aria.templates.section.animations.TestTemplate",
    $hasScript : true
}}

    {macro main()}
        {section {
            id : "autoSection2",
            macro : "myMacro2",
            bindRefreshTo : [{
                inside : data,
                to : "animate",
                recursive : true
            },{
                inside : data,
                to : "noAnimate",
                recursive : true,
                animate : false
            }],
            bind : {
                animation : {
                    to : "animation",
                    inside : data
                }
            },
            type : "div"
        }/}
    {/macro}


{macro myMacro2 ()}
    <div style="position:absolute;">
        <h1 class="text-center2" id="animate">${data.animate}</h1>
        <h1 class="text-center2" id="noAnimate">${data.noAnimate}</h1>
    </div>
{/macro}

{/Template}
