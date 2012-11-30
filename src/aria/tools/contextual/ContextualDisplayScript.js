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

/**
 * Script associated to the contextual menu for debugging
 * @class aria.tools.contextual.ContextualDisplayScript
 */
Aria.tplScriptDefinition({
    $classpath : 'aria.tools.contextual.ContextualDisplayScript',
    $prototype : {
        /**
         * Call the bridge to notify that this template context has to be inspected, and start it if not opened yet
         * @param {aria.DomEvent} event
         */
        openDebug : function (event) {
            var driver = this.data.driver;
            driver.openTools();
        },

        /**
         * Reload associated template context
         * @param {aria.DomEvent} event
         */
        reloadTemplate : function (event) {
            this.data.templateCtxt.$reload();
            this.data.driver.close();
        },

        /**
         * Reload associated module
         * @param {aria.DomEvent} event
         */
        reloadModule : function () {
            aria.templates.ModuleCtrlFactory.reloadModuleCtrl(this.data.templateCtxt.moduleCtrlPrivate);
            this.data.driver.close();
        }
    }
});
