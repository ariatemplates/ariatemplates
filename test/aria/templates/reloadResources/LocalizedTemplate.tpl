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

// Sample template for reload of resources
{Template {
    $classpath: "test.aria.templates.reloadResources.LocalizedTemplate",
    $res: {
        res:"test.aria.templates.reloadResources.ExternalResource"
    }
}}

    {macro main()}
        <h1>${res.hello.label.welcome}</h1>

        <a href="${res.hello.link.ariaTemplatesDoc}">${res.hello.label.ariaTemplatesDoc}</a><br/><br/>

        {@aria:Button {
            label:res.common.label.ok
        }/}

    {/macro}

{/Template}
