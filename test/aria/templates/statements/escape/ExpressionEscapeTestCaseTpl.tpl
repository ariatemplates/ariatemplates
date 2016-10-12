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
    $classpath: 'test.aria.templates.statements.escape.ExpressionEscapeTestCaseTpl'
}}

{macro main()}



/*******************************************************************************
 * Automatic escaping
 ******************************************************************************/

{var id = "automatic" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input}
</div>



/*******************************************************************************
 * Explicit final escaping
 ******************************************************************************/

// ------------------------------------------------------------------ Escape all

{var id = "all-implicit" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML}
</div>

{var id = "all-boolean" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeforHTML:c.escape}
</div>

{var id = "all-object" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForhtml:c.escape}
</div>

// -------------------------------------------------------------- Escape nothing

{var id = "nothing-boolean" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHtml:c.escape}
</div>

{var id = "nothing-object" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeforHtml:c.escape}
</div>

// ------------------------------------------------ Escape for specific contexts

{var id = "attr" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeforhtml:c.escape}
</div>

{var id = "text" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|ESCAPEFORHTML:c.escape}
</div>


{var id = "attr-special" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    <div data-quot="${'"quot"'|escapeForHTML:c.escape}" data-apos='${"'apos'"|escapeForHTML:c.escape}'></div>
</div>



/*******************************************************************************
 * Other modifiers behavior
 ******************************************************************************/

// --------------------------------------------------------------------- default

{var id = "automatic-modifier_default" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|default:c.modifiers["default"][0]}
</div>

{var id = "nothing-modifier_default-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|default:c.modifiers["default"][0]}
</div>

{var id = "nothing-modifier_default-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|default:c.modifiers["default"][0]|escapeForHTML:c.escape}
</div>

{var id = "all-modifier_default-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|default:c.modifiers["default"][0]}
</div>

{var id = "all-modifier_default-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|default:c.modifiers["default"][0]|escapeForHTML:c.escape}
</div>

// ----------------------------------------------------------------------- empty

{var id = "automatic-modifier_empty" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|empty:c.modifiers["empty"][0]}
</div>

{var id = "nothing-modifier_empty-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|empty:c.modifiers["empty"][0]}
</div>

{var id = "nothing-modifier_empty-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|empty:c.modifiers["empty"][0]|escapeForHTML:c.escape}
</div>

{var id = "all-modifier_empty-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|empty:c.modifiers["empty"][0]}
</div>

{var id = "all-modifier_empty-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|empty:c.modifiers["empty"][0]|escapeForHTML:c.escape}
</div>

// ------------------------------------------------------------------- highlight

{var id = "automatic-modifier_highlight" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|highlight:c.modifiers["highlight"][0]}
</div>

{var id = "nothing-modifier_highlight-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|highlight:c.modifiers["highlight"][0]}
</div>

{var id = "nothing-modifier_highlight-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|highlight:c.modifiers["highlight"][0]|escapeForHTML:c.escape}
</div>

{var id = "all-modifier_highlight-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|highlight:c.modifiers["highlight"][0]}
</div>

{var id = "all-modifier_highlight-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|highlight:c.modifiers["highlight"][0]|escapeForHTML:c.escape}
</div>

// ------------------------------------------------------------------ dateformat

{var id = "automatic-modifier_dateformat" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|dateformat:c.modifiers["dateformat"][0]}
</div>

{var id = "nothing-modifier_dateformat-before" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|escapeForHTML:c.escape|dateformat:c.modifiers["dateformat"][0]}
</div>

{var id = "nothing-modifier_dateformat-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|dateformat:c.modifiers["dateformat"][0]|escapeForHTML:c.escape}
</div>

// This one should fail
// {var id = "all-modifier_dateformat-before" /}
// <div {id id /}>
//     {var c = data.useCases[id] /}
//     ${c.input|escapeForHTML:c.escape|dateformat:c.modifiers["dateformat"][0]}
// </div>
// ----

{var id = "all-modifier_dateformat-after" /}
<div {id id /}>
    {var c = data.useCases[id] /}
    ${c.input|dateformat:c.modifiers["dateformat"][0]|escapeForHTML:c.escape}
</div>


{/macro}

{/Template}
