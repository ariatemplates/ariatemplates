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
var Aria = require("../Aria");
var ariaTemplatesIObjectLoading = require("./IObjectLoading");
var ariaTemplatesPublicWrapper = require("./PublicWrapper");


/**
 * Object which raises an event when an object is loaded.
 * @class aria.templates.ObjectLoading
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.templates.ObjectLoading',
    $extends : ariaTemplatesPublicWrapper,
    $implements : [ariaTemplatesIObjectLoading],
    $constructor : function () {
        this.$PublicWrapper.constructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : 'aria.templates.IObjectLoading',

        /**
         * Notify listeners that the object is loaded.
         * @param {Object} object reference to the object just loaded.
         */
        notifyObjectLoaded : function (object) {
            this.$raiseEvent({
                name : "objectLoaded",
                object : object
            });
        }
    }
});
