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
    $classpath:'aria.tester.runner.view.links.Links',
    $hasScript:true,
    $width : {value:200},
    $height : {min:125},
    $css:['aria.tester.runner.view.links.LinksCSS']
}}
    {macro main()}
        <h1>Links</h1>
        <ul class="container">
            {var docLinks = this.getDocumentationLinks()/}
            {foreach link in docLinks}
                <li class="item">
                    <a
                        href="${link.href}"
                        target="_blank"
                    >
                        ${link.title}
                    </a>
                </li>
            {/foreach}
            {var keyboardShortcuts = getKeyboardShortcuts()/}
            {foreach link in keyboardShortcuts}
                <li class="item">
                    <a
                        {on click {
                            fn : link.callback,
                            scope : this
                        }/}
                    >
                        Press <b>${link.key}</b> : ${link.description}
                    </a>
                </li>
            {/foreach}
        </ul>
    {/macro}
{/Template}
