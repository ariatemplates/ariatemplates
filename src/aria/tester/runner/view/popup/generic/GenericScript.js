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
var Aria = require("../../../../../Aria");


/**
 * Template script definition for aria.tester.runner.view.popup.generic.Generic
 */
module.exports = Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.popup.generic.GenericScript',
    $constructor : function () {
        this.keys = this._getKeys();
        var keys = this.keys;
        for (var i = 0, l = keys.length; i < l; i++) {
            aria.templates.NavigationManager.addGlobalKeyMap({
                key : keys[i][0],
                callback : {
                    fn : keys[i][1],
                    scope : this
                }
            });
        }
    },

    $destructor : function () {
        var keys = this.keys;
        for (var i = 0, l = keys.length; i < l; i++) {
            aria.templates.NavigationManager.removeGlobalKeyMap({
                key : keys[i][0],
                callback : {
                    fn : keys[i][1],
                    scope : this
                }
            });
        }
    },
    $prototype : {
        getLabelWithShortcut : function (label) {
            var firstChar = "<u>" + label.substring(0, 1).toUpperCase() + "</u>";
            var labelWithShortcut = firstChar + label.substring(1);
            return labelWithShortcut;
        }
    }
});
