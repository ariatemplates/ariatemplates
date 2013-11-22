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
 * Template script definition for aria.tester.runner.view.popup.options.Options
 */
Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.popup.options.OptionsScript',
    $dependencies : [],
    $prototype : {
        _onApplyButtonClicked : function () {
            this.flowCtrl.navigate(this.flowCtrl.STATES.READY);
        },

        _onCancelButtonClicked : function () {
            this.flowCtrl.navigate(this.flowCtrl.STATES.READY);
        },

        _getKeys : function () {
            var keys = [
                ["A", this._onApplyButtonClicked],
                ["C", this._onCancelButtonClicked]
            ];
            return keys;
        }
    }
});
