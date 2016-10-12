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
   $classpath: "test.aria.utils.overlay.loadingIndicator.scrollbar.ScrollbarTestCaseTpl"
}}
    {macro main()}
        <div {id "myParentDiv"/} style="padding:20px;border:solid 2px black;width:500px;height:400px;background-color:orange;left:10px;top:10px;position:absolute;overflow:auto;">
            <div {id "myChildDiv"/} style="padding:20px;border:solid 2px black;width:400px;height:300px;position:absolute;background-color:white;left:100px;top:150px;overflow:scroll;">
                <div {id "myScrolledDiv"/} style="padding:20px;border:solid 2px black;width:200px;height:100px;background-color:green;left:350px;top:350px;position:absolute;">
                </div>
                <div style="position:absolute;width:3000px;height:3000px;left:2000px;top:2000px;"></div>
            </div>
            <div style="position:absolute;width:2000px;height:2000px;left:3000px;top:3000px;"></div>
        </div>
    {/macro}
{/Template}
