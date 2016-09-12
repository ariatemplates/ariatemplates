{Template {
  $classpath : "test.aria.templates.keyboardNavigation.bingCompatibility.KeyMapBingCompatibilityTestCaseTpl",
  $wlibs: {
          "embed": "aria.embed.EmbedLib"
  }
}}

  {macro main()}
    <div class="mapSampleContainer">
    {@embed:Map {
        id : "map",
        provider : "microsoft7",
        loadingIndicator : true,
        type : "DIV",
        attributes : {
          classList : ["mapContainer"]
        }
    }/}


    </div>

    {@aria:Select {
        id : "select",
        label : "All Countries: ",
        labelWidth : 220,
        options : data.countries,
        bind : {
            value : {
                to : "country",
                inside : data
            }
        }
    }/}

    <input {id "justToFocusOut"/}>


  {/macro}

{/Template}
