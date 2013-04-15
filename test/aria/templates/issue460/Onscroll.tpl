/**
 * Copyright Amadeus
 */
{Template {
  $classpath : "test.aria.templates.issue460.Onscroll",
  $hasScript: true
} }

  {macro main ( )}
    <h3>This sample demonstrates the usage of onScroll event</h3>
        <div id="touchMe" style="width:200px;height:200px; background-color:#ffa500;overflow:auto;" {on scroll {
        fn : this.onScroll,
        scope : this
      }/}>
        Please scroll this field!
        <div style="height:300px; width:2000px; background-color:#ffa500;"></div>
First
        <div style="height:300px; width:2000px; background-color:#808080;"></div>
     second
		</div>
<div id="horizontal"></div>
<div id="vertical"></div>
  {/macro}

{/Template}
