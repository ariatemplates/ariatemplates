/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

{Template {
    $classpath : "test.aria.widgets.splitter.scrollbars.ScrollbarTestCaseTpl"
}}

    {macro main()}
        {@aria:Splitter {
            sclass: "std",
            orientation:"vertical",
            border:true,
            size2:300,
            height:200,
            width:600,
            adapt:"both", //["size1","size2","both"]
            macro1:'Panel1',
            macro2:'Panel2'
        }}
    {/@aria:Splitter}
    {/macro}

    {macro Panel1()}
        <div style="padding:5px;">
            <h3> Third panel </h3>
            <p>es simplemente el texto.  </p>
        </div>
    {/macro}

    {macro Panel2()}

         {@aria:Splitter {
            sclass: "std",
            orientation:"horizontal",
            border:true,
            size1:90,
            size2:90,
            height:196,
            width:298,
            adapt:"size1", //["size1","size2","both"]
            macro1:'Panel3',
            macro2:'Panel4'
        }}
        {/@aria:Splitter}

      {/macro}
      {macro Panel3()}
          <div style="padding:5px;">
              <h3> Fifth panel </h3>
          </div>
      {/macro}
      {macro Panel4()}
          <div style="padding:5px;">
              <h3> Sixth panel </h3>
          </div>

      {/macro}


{/Template}
