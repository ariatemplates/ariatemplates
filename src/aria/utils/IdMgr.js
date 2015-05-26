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
var ariaUtilsArray = require("./Array");


/**
 * Handle Id generation
 * @class aria.utils.IdMgr
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.IdMgr',

    $statics : {
         ID_ALREADY_RELEASED : "Id %1 is already released."
    },

    /**
     * Constructor
     * @param {String} prefix
     */
    $constructor : function (prefix) {
        /**
         * List of free ids
         * @protected
         * @type Array
         */
        this._freeId = [];

        /**
         * Counter for ids when none is free
         * @protected
         * @type Number
         */
        this._idCounter = 0;

        /**
         * Prefix for the ids
         * @type String
         */
        this.prefix = prefix || "";

    },
    $destructor : function () {
        this._freeId = null;
    },
    $prototype : {

        /**
         * Create a unique id. Either reuse an existing reusable id or create a new one if none exist.
         */
        getId : function () {
            if (this._freeId.length) {
                return this._freeId.pop();
            }
            var id = this.prefix + this._idCounter;
            this._idCounter++;
            return id;
        },

        /**
         * Release an id (register it to be reused).
         * @param {String} id
         */
        releaseId : function (id) {

            if (Aria.debug && ariaUtilsArray.indexOf(this._freeId, id) > -1) {
                this.$logError(this.ID_ALREADY_RELEASED, [id]);
            }

            this._freeId.unshift(id);
        }
    }
});
