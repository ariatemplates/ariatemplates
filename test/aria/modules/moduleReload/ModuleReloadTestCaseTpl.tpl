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
    $classpath:"test.aria.modules.moduleReload.ModuleReloadTestCaseTpl"
}}

    {macro main()}
        {@aria:Template {
            id: "subTemplate",
            block: true,
            defaultTemplate: "test.aria.modules.moduleReload.SubTemplate",
            moduleCtrl: moduleCtrl.subModule
        }/}
        {if moduleCtrl['custom:customSubModule']}
            {@aria:Template {
                id: "customSubTemplate",
                block: true,
                defaultTemplate: "test.aria.modules.moduleReload.SubTemplate",
                moduleCtrl: moduleCtrl['custom:customSubModule']
            }/}
        {/if}
    {/macro}

{/Template}