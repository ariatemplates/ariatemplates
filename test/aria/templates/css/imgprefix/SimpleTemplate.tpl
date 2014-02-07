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
    $classpath : "test.aria.templates.css.imgprefix.SimpleTemplate",
    $css : ["test.aria.templates.css.imgprefix.SimpleTemplateCss", "test.aria.templates.css.imgprefix.SimpleTemplateCss2"]
}}

{macro main ()}
    <div class="container-1">
        <p>Container 1</p>
    </div>

    <div class="container-2">
        <p>Container 2</p>
    </div>

    <div class="container-3">
        <p>Container 3</p>
    </div>

    <div class="container-4">
        <p>Container 4</p>
    </div>

    <div class="container-5">
        <p>Container 5</p>
    </div>

    <div class="container-6">
        <p>Container 6</p>
    </div>

{/macro}

{/Template}