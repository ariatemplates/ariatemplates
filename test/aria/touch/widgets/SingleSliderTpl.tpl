/*
 * Copyright 2012 Amadeus s.a.s.
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
  $classpath : "test.aria.touch.widgets.SingleSliderTpl",
  $wlibs : {
    "touch" : "aria.touch.widgets.TouchWidgetLib"
  }
}}

  {macro main()}
    Here is a Touch Slider Widget bound with a Text Widget to display a value between $0 and $100 :

    <br><br>

    {@touch:Slider {
      bindValue: {
        to: "slider",
        inside: data
      },
      width: 200,
      id : "slider"
    }/}

    <br>
    {@touch:Slider {
      bindValue: {
        to: "slider1",
        inside: data
      },
      width: 200,
      id : "slider1",
      tapToMove : true
    }/}
    <br>

    {@touch:Slider {
      width: 100,
      id: "switch",
      toggleSwitch : true,
      tapToMove : true,
      bindValue: {
        to: "switchVal",
        inside: data
      }
    }/}
    <br>

    {@touch:Slider {
      width: 100,
      id: "switchToggle",
      toggleSwitch : true,
      tapToToggle : true,
      bindValue: {
        to: "switchVal2",
        inside: data
      }
    }/}

  {section {
      id : "display",
      macro : "values",
      bindRefreshTo : [{
          inside : data,
          to : "switchVal"
      }]
  }/}
  {/macro}

  {macro values()}
    Value $: ${data.switchVal ? (data.switchVal).toFixed(0) : 0}
  {/macro}
{/Template}