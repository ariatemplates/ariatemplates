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
    $classpath: 'test.aria.templates.statements.ExpressionEscapeTestTpl'
}}

{macro main()}

<div {id "default"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"}
</div>

<div {id "implicit"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML}
</div>

<div {id "all-boolean"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML:true}
</div>
<div {id "all-object"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML:{text: true, attr: true}}
</div>

<div {id "nothing-boolean"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML:false}
</div>
<div {id "nothing-object"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML:{text: false, attr: false}}
</div>

<div {id "attr"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML:{attr: true}}
</div>
<div {id "text"/}>
    ${"<div class='output' style=\"color:blue\">&amp;</div>"|escapeForHTML:{text: true}}
</div>


<div {id "special-attr"/}>
    <div data-quot="${'"quot"'|escapeForHTML:{attr:true}}" data-apos='${"'apos'"|escapeForHTML:{attr:true}}'></div>
</div>


<div {id "default-modifier-default"/}>
    ${undefined|default:'<div></div>'}
</div>
<div {id "nothing-modifier-default-before"/}>
    ${undefined|escapeForHTML:false|default:'<div></div>'}
</div>
<div {id "nothing-modifier-default-after"/}>
    ${undefined|default:'<div></div>'|escapeForHTML:false}
</div>
<div {id "all-modifier-default-before"/}>
    ${undefined|escapeForHTML:true|default:'<div></div>'}
</div>
<div {id "all-modifier-default-after"/}>
    ${undefined|default:'<div></div>'|escapeForHTML:true}
</div>

<div {id "default-modifier-empty"/}>
    ${''|empty:'<div></div>'}
</div>
<div {id "nothing-modifier-empty-before"/}>
    ${''|escapeForHTML:false|empty:'<div></div>'}
</div>
<div {id "nothing-modifier-empty-after"/}>
    ${''|empty:'<div></div>'|escapeForHTML:false}
</div>
<div {id "all-modifier-empty-before"/}>
    ${''|escapeForHTML:true|empty:'<div></div>'}
</div>
<div {id "all-modifier-empty-after"/}>
    ${''|empty:'<div></div>'|escapeForHTML:true}
</div>

{/macro}

{/Template}
