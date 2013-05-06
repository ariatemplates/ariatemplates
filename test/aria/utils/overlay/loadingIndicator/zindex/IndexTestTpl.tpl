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
   $classpath: "test.aria.utils.overlay.loadingIndicator.zindex.IndexTestTpl"
}}
    {macro main()}

        <div style="z-index:40000;background:purple;padding:10px;">
            <div style="z-index:30000;background:yellow;padding:10px;">
                <div style="background:orange;padding:10px;">

                {var test = {
                    show : true
                }/}

                {section {
                        id : "toto",
                        bindProcessingTo : {
                            inside : test,
                            to : "show"
                        }
                }}

                    <div style="width:200px;height:200px;background:green;">
                    </div>

                {/section}

                </div>
            </div>
        </div>

    {/macro}
{/Template}
