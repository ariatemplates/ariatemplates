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
  $classpath : "test.aria.templates.csslibs.csslibsenv.CssLibs",
  $css : ["test.aria.templates.csslibs.csslibsenv.MainCss"]
}}

  {macro main()}
    <div {id "CssLibTestContainer" /} class="CssLibTestContainer">

        The bgcolor of this DIV is yellow.<br/><br/>

        <h1><a {id "headerLink" /} class="headerLink" href="?1">
            I am normally dark red; cyan if visited; navy blue on hover.
        </a></h1>

        <p {id "para" /} class="para">I am semi-opaque block with green text color.</p>

        <div {id "overriddenStyle" /} class="overriddenStyle">
            I should have border:2px solid red, background-color:linen (parent) and color: #555 (child).<br/>
            If inheritance fails, I will be invisible (linen on linen).
        </div>

        <div {id "colorFromDependency" /} class="colorFromDependency">
            I should have magenta background color.
        </div>

        <div {id "usingCssPath" /} class="usingCssPath">
            I have bg image set in CML using cssPath variable.
        </div>

    </div>
  {/macro}

{/Template}
