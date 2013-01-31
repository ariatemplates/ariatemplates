{Template {
 $classpath:'test.aria.templates.issue353.Main',
// $css : ['test.aria.templates.issue353.MainStyle'],
 $hasScript : false
}}
    // Template entry point
    {macro main()}
        {section {
                id: "list",
                  bindRefreshTo : [{
                   inside : this.data,
                   to : "items"
                  }]
              }}
                  <fieldset>
                <legend>Section bound to this.data.items</legend>
                    <ul>
                          {foreach item in data.items}
                              <li>${item.name}</li>
                        {/foreach}
                    </ul>
                  </fieldset>

              {/section}
              {section {
                id: "sublist",
                  bindRefreshTo : [{
                   inside : this.data,
                   to : "subItems"
                  }]
              }}
                  <fieldset>
                <legend>Section bound to this.data.subItems</legend>
                    <ul>
                          {foreach item in data.subItems}
                              <li>${item.name}</li>
                        {/foreach}
                    </ul>
                  </fieldset>
              {/section}
              {@aria:TextField {
              id: "textField1",
                bind:{value: {inside:this.data.items[0], to:"name"}},
                label : "Value bound to this.data.items[0]",
                block:true
            } /}
              {@aria:TextField {
        id: "textField2",
                bind:{value: {inside:this.data.subItems[0], to:"name"}},
                label : "Value bound to this.data.subItems[0]",
                block:true
            } /}
    <div id="outsideDiv">&nbsp;</div>
    {/macro}
{/Template}

