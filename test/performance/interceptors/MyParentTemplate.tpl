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
  $classpath : "test.performance.interceptors.MyParentTemplate",
  $hasScript : true
}}

  {macro main ( )}
    ${ initialize() }
    {@aria:NumberField {
      label : "Number of templates",
      bind : {
        value : {
          to : "nbTemplates",
          inside : data }
      }
    }/}
    {@aria:Button {
      id : "startBtn",
      label : "Start test",
      onclick : beginTest }/}
    <br /> <hr />
    {if data.displayTemplates}
      {for var i = 0 ; i< data.nbTemplates ; i++}
        {@aria:Template {
          defaultTemplate : "test.performance.interceptors.MyChildTemplate" }/}
      {/for}
    {/if}
  {/macro}

{/Template}