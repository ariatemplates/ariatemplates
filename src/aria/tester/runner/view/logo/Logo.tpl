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

// TODOC
{Template {
    $classpath:'aria.tester.runner.view.logo.Logo',
    $hasScript:false,
    $width : {value:200},
    $height : {value:90},
    $css : ['aria.tester.runner.view.logo.LogoCSS']
}}
    {macro main()}
    <div style="
        margin-left: 15px;
        margin-top: -30px;
    ">
        <div class="lowerCase">a</div><div class="upperCase">RI</div><div class="lowerCase">a</div>
    </div>
    {/macro}
{/Template}
