/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

{Template {
	$classpath:"test.aria.widgets.container.splitter.move.SplitterTestMoveLeftRightTpl",
	$hasScript : true,
	$width : {min: 300, max: 580}
}}
{macro main()}
  <p>This test requires brower zoom level 100%</p>
	<div id="spacer" style="float:left;height:200px;width:100px;background-color:#E2E2E2;">I need some space</div>
	<div id="sampleSplitter" style="float:left;">
    {@aria:Splitter {
	    id:"sampleSplitterElem",
      sclass: "std",
      orientation:"vertical",
      bind:{
        size1: {to: "firstPanelSize",inside:data},
        size2: {to: "secondPanelSize",inside:data}
      },
      height:200,
      border:true,
      width:400,
      adapt:"size2",
      macro1:'PanelOne',
      macro2:'PanelTwo'
    }}
    {/@aria:Splitter}
	</div>
  <div style="float:left; clear:both;">
    {@aria:Link {
        label: "Increment",
        id:"link1",
        onclick: { fn: changeState, args: "mOnePlus" }
    }/}

    {@aria:Link {
        label: "Decrement",
        id:"link2",
        onclick: { fn: changeState, args: "mOneMinus" }
    }/}
  </div>
  {/macro}

  {macro PanelOne()}
    <h3> My First panel </h3>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
  {/macro}

  {macro PanelTwo()}
    <h3> My Second panel </h3>
    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>

  {/macro}

{/Template}
