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
  $classpath : "test.aria.utils.events.scroll.Onscroll",
  $hasScript: true
}}

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
