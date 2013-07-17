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

/**
 * TODOC
 * @class test.aria.templates.focusAfterRefresh.RefreshTemplateScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.templates.focusAfterRefresh.RefreshTemplateScript',
    $prototype : {
        /**
         * Refreshes all templates and widgets.
         */
        refresh : function () {
            aria.core.Timer.addCallback({
                fn : this.$refresh,
                scope : this,
                delay : 200
            });
        },
        /**
         * Gets the element that is currently in focus and retrieves the widget and template ID for the element.
         */
        $beforeRefresh : function () {
            this.$setFocusedWidget();
        },
        /**
         * Sets the focus to the template containing the widget that needs focus.
         */
        $afterRefresh : function () {
            this.$focus(this.$getFocusedWidget());
        }
    }
});