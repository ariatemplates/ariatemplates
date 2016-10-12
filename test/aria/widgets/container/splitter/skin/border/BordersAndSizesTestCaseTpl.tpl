/*
 * Copyright 2014 Amadeus s.a.s.
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
	$classpath:"test.aria.widgets.container.splitter.skin.border.BordersAndSizesTestCaseTpl"
}}

   {macro main()}
      {@aria:Splitter {
         id: "splitter",
         orientation: data.orientation,
         border: data.border,
         sclass: data.sclass,
         macro1: "panel1",
         macro2: "panel2",
         width: data.width,
         height: data.height,
         bind : {
            size1 : {
               inside : data,
               to : "sizeA"
            },
            size2 : {
               inside : data,
               to : "sizeB"
            }
         }
      }}
      {/@aria:Splitter}
   {/macro}

   {macro panel1()}
      Panel 1
   {/macro}

   {macro panel2()}
      Panel 2
   {/macro}

{/Template}
