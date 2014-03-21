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
    $classpath:"test.aria.templates.layoutResize.ResizeTemplate",
    $width:{min:250},
    $height:{min:250}
}}
    {macro main()}

    {if data.showDiv == true}

    <div id="resizableDiv" style="background-color: red; width: ${$hdim(250,1)}px; height: ${$vdim(250,1)}px;">
        The size of this div changes according to the width of this template.
    <div>

    {/if}

    {/macro}

{/Template}
