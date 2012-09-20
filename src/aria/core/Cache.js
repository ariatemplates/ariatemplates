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
 * Cache object used to synchronize data retrieved from the server and avoid reloading the same resource several times
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.Cache",
    $singleton : true,
    $statics : {
        /**
         * Map the content type to the file name extension.
         * @type Object
         */
        EXTENSION_MAP : {
            "JS" : ".js",
            "TPL" : ".tpl",
            "CSS" : ".tpl.css",
            "TML" : ".tml",
            "CML" : ".cml",
            "TXT" : ".tpl.txt",
            "RES" : ".js"
        }
    },
    $prototype : {
        /**
         * Cache content Note: stored at prototype level as Cache is a singleton
         * @type Map
         */
        content : {},

        /**
         * Cache item status when just created
         * @type Number
         */
        STATUS_NEW : 1,

        /**
         * Cache item status when being (down)loaded
         * @type Number
         */
        STATUS_LOADING : 2,

        /**
         * Cache item status when item has been succesfully downloaded
         * @type Number
         */
        STATUS_AVAILABLE : 3,

        /**
         * Cache item status when item cannot be loaded
         * @type Number
         */
        STATUS_ERROR : 4,

        /**
         * Get (and optionally create) a cache entry
         * @param {String} cat item category (first key used in content Map to create a sub-map)
         * @param {String} key item key in the category Map
         * @param {Boolean} createIfNull [default:false] create an item if none is already defined
         * @return {Object} a cache item structure:
         *
         * <pre>
         * {
         *      status: {Integer} indicates the item status [STATUS_NEW | STATUS_LOADING | STATUS_AVAILABLE | STATUS_ERROR]
         *      value: {Object} value associated to the item
         *      loader: {Object} loader object associated to this item when status = STATUS_LOADING
         * }
         * </pre>
         */
        getItem : function (cat, key, createIfNull) {
            if (createIfNull !== true) {
                createIfNull = false;
            }
            var res = null;
            if (createIfNull) {
                if (this.content[cat] == null) {
                    this.content[cat] = {};
                }
                var res = this.content[cat][key];
                if (res == null) {
                    res = {
                        status : this.STATUS_NEW,
                        value : null
                        // loader:null - don't need to be created if not used
                    };
                    this.content[cat][key] = res;
                }
            } else {
                if (this.content[cat] != null) {
                    res = this.content[cat][key];
                }
            }
            return res;
        },

        /**
         * Get the logical filename from the classpath. Returns null if the classpath is not inside the cache.
         * @param {String} classpath e.g x.y.MyClass
         * @return {String} logical path e.g x/y/MyClass.tpl
         */
        getFilename : function (classpath) {
            var classContent = this.getItem("classes", classpath, false);

            if (classContent) {
                return classpath.replace(/\./g, "/") + this.EXTENSION_MAP[classContent.content];
            }
        }

    }
});