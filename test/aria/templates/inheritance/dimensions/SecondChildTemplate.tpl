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
    $classpath: "test.aria.templates.inheritance.dimensions.SecondChildTemplate",
    $extends: "test.aria.templates.inheritance.dimensions.ParentTemplate",
    $width: {min:100},
    $height: {min:70}
}}

    {macro main()}
    <div {id "secondchild1"/}>second child width ${$hdim(40,0.5)}</div>
    <div {id "secondchild2"/}>second child height ${$vdim(40,0.5)}</div>
    {/macro}

{/Template}
