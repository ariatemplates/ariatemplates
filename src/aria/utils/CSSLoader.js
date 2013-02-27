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
 * Utility to load external CSS files. Do NOT use it for loading CSS Templates
 */
Aria.classDefinition({
    $classpath : "aria.utils.CSSLoader",
    $singleton : true,
    $dependencies : ["aria.utils.IdManager", "aria.utils.Type", "aria.utils.Object", "aria.core.DownloadMgr"],
    $statics : {

        /**
         * Prefix used for the ids of the style tags
         * @type String
         */
        TAG_PREFIX : "xCss",

        /**
         * Default media of the style tag
         * @type String
         */
        DEFAULT_MEDIA : "all"
    },
    $constructor : function () {

        /**
         * Store of the information on the css files that were already added
         * @type Object
         * @private
         */
        this._store = {};

        /**
         * Generator of unique ids for the style tags
         * @type aria.utils.IdManager
         * @private
         */
        this._idManager = new aria.utils.IdManager(this.TAG_PREFIX);

    },
    $destructor : function () {
        this.removeAll();
        this._store = null;
        this._idManager.$dispose();
    },
    $prototype : {

        /**
         * Add the CSS files by creating link tags in the head of the page
         * @param {Array|String} sources An array of CSS files to add or a single file
         * @param {String} media Media for the link tag. It defaults to "all"
         * @return {Array} Array of the tag elements corresponding to the required sources
         */
        add : function (sources, media) {
            media = media || this.DEFAULT_MEDIA;
            if (aria.utils.Type.isString(sources)) {
                sources = [sources];
            }
            var source, storeId, tagArray = [];
            for (var i = 0, length = sources.length; i < length; i++) {
                source = sources[i];
                storeId = this._getStoreId(source, media);
                if (this._store[storeId]) {
                    this._store[storeId].count++;
                    tagArray.push(this._store[storeId].tag);
                } else {
                    var tag = this._addLinkTag(source, media, this._idManager.getId());
                    tagArray.push(tag);
                    this._store[storeId] = {
                        count : 1,
                        tag : tag
                    };
                }
            }
            return tagArray;
        },

        /**
         * Remove link tags previously added in the head of the page. If a certain css file is added n times (for the
         * same media), the remove method has to be called n times in order for the corresponding link tag to be removed
         * @param {Array|String} sources An array of CSS files to remove or a single file
         * @param {String} media Media for the link tag. It defaults to "all"
         */
        remove : function (sources, media) {
            media = media || this.DEFAULT_MEDIA;
            if (aria.utils.Type.isString(sources)) {
                sources = [sources];
            }
            var source, storeId;
            for (var i = 0, length = sources.length; i < length; i++) {
                source = sources[i];
                storeId = this._getStoreId(source, media);
                this._remove(storeId);
            }
        },

        /**
         * Remove link tags previously added in the head of the page. If a certain css file is added n times (for the
         * same media), the _remove method has to be called n times in order for the corresponding link tag to be
         * removed. If the force argument is set to true, the link tag will be removed on the first call.
         * @param {String} storeId Id used to store the information on the added file
         * @param {Boolean} force If true, the css will be removed even if it has been added several times
         * @private
         */
        _remove : function (storeId, force) {
            var info = this._store[storeId], tag;
            if (info) {
                if (!force && info.count > 1) {
                    info.count--;
                } else {
                    tag = info.tag;
                    tag.parentNode.removeChild(tag);
                    tag = null;
                    delete this._store[storeId];
                }
            }
        },

        /**
         * Unload all the CSS previously added
         */
        removeAll : function () {
            var storeIds = aria.utils.Object.keys(this._store);
            for (var i = 0, length = storeIds.length; i < length; i++) {
                this._remove(storeIds[i], true);
            }
        },

        /**
         * Create a link tag in the head of the page
         * @param {String} source
         * @param {String} media
         * @param {String} id
         * @return {HTMLElement} tag that has been added
         * @private
         */
        _addLinkTag : function (source, media, id) {
            var document = Aria.$window.document;
            var head = document.getElementsByTagName("head")[0];
            var tag = document.createElement("link");

            tag.id = id;
            tag.type = "text/css";
            tag.media = media;
            tag.rel = "stylesheet";
            tag.href = aria.core.DownloadMgr.resolveURL(source);

            head.appendChild(tag);
            tag = head.lastChild;
            return tag;
        },

        /**
         * Return the id that is used to store the information on the style
         * @param {String} source Source of the file
         * @param {String} media type of media
         * @return {String}
         * @private
         */
        _getStoreId : function (source, media) {
            return [source, "_", media].join("");
        }
    }
});
