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
  $classpath:'test.aria.templates.htmlstyle.HtmlStyleTemplate',
  $wlibs : {
        html : "aria.html.HtmlLibrary"
    }

}}

    {macro main()}

      {@html:Template {
          id: "id1",
          type:"div",
          classpath: "test.aria.templates.htmlstyle.HtmlSubTemplate",
          attributes:{
              classList:["c1","c2"],
              title:"This acts like a title",
               style: "border:1px solid red;padding:10px;background-color:red;height:100px;width:200px;"
          }
      }/}

      {@aria:Template {
      defaultTemplate:"test.aria.templates.htmlstyle.HtmlSubTemplate",
      id:"id2",
      width: 400,
      height: 150
    }/}

    {@html:Template {
      id: "id3",
      type:"div",
      classpath: "test.aria.templates.htmlstyle.HtmlSubTemplate",
      attributes:{
        classList:["c1","c2"],
        title:"This acts like a title",
        style: "border:1px solid red;padding:10px;background-color:red;"
      }
        }/}

    {@aria:Template {
      defaultTemplate:"test.aria.templates.htmlstyle.HtmlSubTemplate",
      id:"id4"
    }/}

    {/macro}

{/Template}
