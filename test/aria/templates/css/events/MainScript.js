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

Aria.tplScriptDefinition({
    $classpath : "test.aria.templates.css.events.MainScript",
    $destructor : function () {
        aria.templates.CSSMgr.$removeListeners({
            "*" : {
                fn : this._logEvent,
                scope : this
            }
        });
    },
    $prototype : {
        $dataReady : function () {
            aria.templates.CSSMgr.$on({
                "*" : {
                    fn : this._logEvent,
                    scope : this
                }
            });
        },
        click : function () {
            aria.templates.RefreshManager.stop();

            // Clear all the events
            this.data.eventsRaised = [];

            switch (this.data.step) {
                case 0 :
                    // Unload the first template
                    this.$json.setValue(this.data, "step", 1);
                    this.$json.setValue(this.data, "template1", false);
                    break;
                case 1 :
                    // Load the second first template
                    this.$json.setValue(this.data, "step", 2);
                    this.$json.setValue(this.data, "template2", true);
                    break;
                default :
                    // Unload everything
                    this.$json.setValue(this.data, "step", 0);
                    this.$json.setValue(this.data, "template1", false);
                    this.$json.setValue(this.data, "template2", false);
                    break;
            }
            aria.templates.RefreshManager.resume();
        },

        _logEvent : function (evt) {
            this.data.eventsRaised.push(evt);
        }
    }
});
