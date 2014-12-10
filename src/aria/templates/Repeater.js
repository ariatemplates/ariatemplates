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
var ariaTemplatesSection = require("./Section");
var ariaUtilsType = require("../utils/Type");
var ariaUtilsArray = require("../utils/Array");
var ariaUtilsJson = require("../utils/Json");


(function () {
    var idMgr = null;
    var typeUtils = null;
    var jsonUtils = null;
    var arrayUtils = null;

    /**
     * Return whether the specified parameter is a callback or not.
     * @param {Object} obj
     * @return {Boolean} true if obj is a callback (either a function reference or an object containing a 'fn'
     * property).
     * @private
     */
    var _isCallback = function (obj) {
        return obj && (typeUtils.isFunction(obj) || obj.fn);
    };

    /**
     * Repeater, which automatically adds or removes sub-sections when the array to which it is bound is modified.
     * @class aria.templates.Repeater
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.templates.Repeater',
        $extends : ariaTemplatesSection,
        $constructor : function (tplCtxt, cfg, options) {
            if (cfg.id == null) {
                cfg.id = idMgr.getId();
                this._dynamicId = cfg.id;
            }
            this.$Section.constructor.call(this, tplCtxt, cfg, options);

            if (!this.cfgOk) {
                return;
            }

            if (cfg.macro) {
                this.cfgOk = false;
                this.$logError(this.REPEATER_MACRO_NOT_SUPPORTED, [this.tplCtxt.tplClasspath, this.id]);
                return;
            }

            /**
             * Array of the displayed items.
             * @type Array
             */
            this.items = [];

            /**
             * Map of displayed items. Only used in case loopType is map.
             * @type Object
             */
            this.itemsMap = null;

            /**
             * Id counter for children, start with zero, incremented each time a new one is needed and never
             * decremented.
             * @type Number
             * @protected
             */
            this._childIdSuffix = 0;

            /**
             * @type String
             * @protected
             */
            this._loopType = cfg.loopType;

            /**
             * @type Array|Object|aria.templates.View
             */
            this.iteratedSet = cfg.content;
            if (!this._updateLoopType()) {
                this.cfgOk = false;
                return;
            }

            this._registerIteratedSetListener();

            this._setChildSectionsCfg(cfg.childSections);

        },
        $destructor : function () {
            if (this._dynamicId) {
                idMgr.releaseId(this._dynamicId);
            }
            // this._cfg = null;
            this._unregisterIteratedSetListener();
            this.$Section.$destructor.call(this);
        },
        $onload : function () {
            idMgr = new aria.utils.IdManager("__repeater");
            typeUtils = ariaUtilsType;
            jsonUtils = ariaUtilsJson;
            arrayUtils = ariaUtilsArray;
        },
        $onunload : function () {
            idMgr.$dispose();
            idMgr = null;
            typeUtils = null;
            arrayUtils = null;
            jsonUtils = null;
        },
        $statics : {
            REPEATER_INVALID_ITERATED_SET : "Error in template '%1': the value declared in bindContentTo in the repeater '%2' is not valid or not compatible with the loopType property (%3).",
            VIEWS_NOT_SUPPORTED : "Template %1, repeater %2: support for views is not yet implemented in the repeater.",
            REPEATER_MACRO_NOT_SUPPORTED : "Error in template '%1', in the repeater '%2': the macro property is not supported for repeaters."
        },
        $prototype : {
            /**
             * Method called when this repeater is about to be refreshed.
             * @param {aria.templates.CfgBeans:GetRefreshedSectionCfg} args arguments given to the getRefreshedSection
             * method. The arguments are modified to add default parameters (macro) if not specified.
             */
            beforeRefresh : function (args) {
                // TODO: check that args.macro and section are not defined, and raise an error if this is the case
                args.writerCallback = {
                    fn : this._refreshWriterCallback,
                    scope : this
                };
            },

            _refreshWriterCallback : function (out) {
                // reinitialize properties of the repeater:
                this.items = [];
                this.itemsMap = {};
                this._childIdSuffix = 0;
                // then write the repeater content:
                this.writeContent(out);
            },

            _createSectionParam : function (item) {
                var childSections = this._childSections;
                var cbProperties = this._childSectCBProp;
                var constProperties = this._childSectConstProp;
                var res = {};
                item.sectionId = this.tplCtxt.evalCallback(childSections.id, item); // create the id for that section
                res.id = item.sectionId;
                var i, l, property;
                for (i = 0, l = cbProperties.length; i < l; i++) {
                    property = cbProperties[i];
                    res[property] = this.tplCtxt.evalCallback(childSections[property], item);
                }
                for (i = 0, l = constProperties.length; i < l; i++) {
                    property = constProperties[i];
                    res[property] = childSections[property];
                }
                return res;
            },

            _initItem : function (item) {
                item.iteratedSet = this.iteratedSet;
                item.sectionIdSuffix = "" + this._childIdSuffix;
                this._childIdSuffix++;
            },

            _writeRepeaterItem : function (item) {
                this._initItem(item);
                this.items[item.ct - 1] = item; // keep the array of items
                var sectionParam = this._createSectionParam(item);
                this.tplCtxt.__$insertSection(0, sectionParam);
            },

            _loopOver_array : function (iteratedSet, method, param) {
                for (var i = 0, l = iteratedSet.length; i < l; i++) {
                    method.call(this, {
                        index : i,
                        ct : i + 1,
                        item : iteratedSet[i]
                    }, param);
                }
            },

            _loopOver_sortedView : function (iteratedSet, method, param) {
                iteratedSet.refresh();
                var items = iteratedSet.items;
                for (var i = 0, l = items.length; i < l; i++) {
                    var info = items[i];
                    method.call(this, {
                        index : i,
                        ct : i + 1,
                        info : info,
                        item : info.value
                    }, param);
                }
            },

            _loopOver_filteredView : function (iteratedSet, method, param) {
                iteratedSet.refresh();
                var items = iteratedSet.items;
                var ct = 1;
                for (var i = 0, l = items.length; i < l; i++) {
                    var info = items[i];
                    if (info.filteredIn) {
                        method.call(this, {
                            index : i,
                            ct : ct,
                            info : info,
                            item : info.value
                        }, param);
                        ct++;
                    }
                }
            },

            _loopOver_pagedView : function (iteratedSet, method, param) {
                iteratedSet.refresh();
                var page = iteratedSet.pages[iteratedSet.currentPageIndex];
                var items = iteratedSet.items;
                var ct = 1;
                for (var i = page.firstItemIndex, l = page.lastItemIndex; i <= l; i++) {
                    var info = items[i];
                    if (info.filteredIn) {
                        method.call(this, {
                            index : i,
                            ct : ct,
                            info : info,
                            item : info.value
                        }, param);
                        ct++;
                    }
                }
            },

            _loopOver_map : function (iteratedSet, method, param) {
                var ct = 1;
                this.itemsMap = {};
                for (var i in iteratedSet) {
                    if (iteratedSet.hasOwnProperty(i) && !jsonUtils.isMetadata(i)) {
                        var item = {
                            index : i,
                            ct : ct,
                            item : iteratedSet[i]
                        };
                        method.call(this, item, param);
                        this.itemsMap[i] = item;
                        ct++;
                    }
                }
            },

            _defaultCallback_id : function (item, constValue) {
                return constValue + item.sectionIdSuffix;
            },

            _defaultCallback_macro : function (item, constValue) {
                var args = arrayUtils.clone(constValue.args);
                args.push(item);
                return {
                    name : constValue.name,
                    args : args,
                    scope : constValue.scope
                };
            },

            _setChildSectionsCfg : function (childSections) {
                var res = {};
                var cbProperties = [];
                var constProperties = [];
                for (var property in childSections) {
                    if (childSections.hasOwnProperty(property)) {
                        var value = childSections[property];
                        res[property] = value;
                        if (_isCallback(value)) {
                            if (property != "id") {
                                cbProperties.push(property);
                            }
                        } else if (property == "id" || property == "macro") {
                            if (property == "macro") {
                                value = this.tplCtxt.checkMacro(value);
                            }
                            res[property] = {
                                fn : this["_defaultCallback_" + property],
                                args : value,
                                scope : this
                            };
                            if (property != "id") {
                                cbProperties.push(property);
                            }
                        } else {
                            constProperties.push(property);
                        }
                    }
                }
                this._childSectCBProp = cbProperties;
                this._childSectConstProp = constProperties;
                this._childSections = res;
            },

            _registerIteratedSetListener : function () {
                var loopType = this._loopType;
                if (loopType == "array" || loopType == "map") {
                    var listener = {
                        scope : this,
                        fn : this._notifyChange
                    };
                    jsonUtils.addListener(this.iteratedSet, null, listener);
                    this._iteratedSetListener = listener;
                }
            },

            _unregisterIteratedSetListener : function () {
                var listener = this._iteratedSetListener;
                if (listener) {
                    jsonUtils.removeListener(this.iteratedSet, null, listener);
                    this._iteratedSetListener = null;
                }
            },

            _notifyIteratedSetReplaced : function (change) {
                this._unregisterIteratedSetListener();
                this.tplCtxt.$refresh({
                    section : this.id
                });
            },

            refreshManagerWholeUpdate : function () {
                this.$assert(341, this._refreshMgrInfo);
                // return true if _refreshManagerCallback will do a whole update
                return this._refreshMgrInfo.queue == null;
            },

            _refreshManagerCallback : function () {
                var refreshMgrInfo = this._refreshMgrInfo;
                if (!refreshMgrInfo) {
                    // may have already been disposed
                    return;
                }
                this._refreshMgrInfo = null;
                var queue = refreshMgrInfo.queue;
                if (queue) {
                    // TODO: optimize queue
                    for (var i = 0, l = queue.length; i < l; i++) {
                        this._notifyChange(queue[i]);
                    }
                } else {
                    this.tplCtxt.$refresh(refreshMgrInfo.refreshArgs);
                }
            },

            _checkRefreshManager : function (arg) {
                if (aria.templates.RefreshManager.isStopped()) {
                    var queue = this._registerInRefreshMgr().queue;
                    if (queue) {
                        queue.push(arg);
                    }
                    return true;
                }
                return false;
            },

            _notifyChange_array : function (arg) {
                if (this._checkRefreshManager(arg)) {
                    return;
                }
                // NOTE: Due to the refresh manager, this method may be called some time after the modification happened
                // on the array, and several other modifications may have happened after that
                var change = arg.change;
                var items = this.items;
                if (change == jsonUtils.VALUE_CHANGED || change == jsonUtils.KEY_REMOVED
                        || change == jsonUtils.KEY_ADDED) {
                    // note that KEY_REMOVED is not different from VALUE_CHANGED with an undefined new value in this
                    // case
                    var index = parseInt(arg.dataName, 10);
                    if (index != arg.dataName || index < 0) {
                        // ignore indexes which are not positive integers
                        return;
                    }
                    if (index < items.length) {
                        // only a change of item, not changing the size of the array
                        jsonUtils.setValue(items[index], "item", arg.newValue);
                        // refresh the corresponding section
                        this.tplCtxt.$refresh({
                            section : items[index].sectionId
                        });
                    } else {
                        // the index is such that it is needed to add a number of sections at the end
                        var itemsLength = items.length;
                        var sections = [];
                        for (var i = itemsLength; i <= index; i++) {
                            var itemParam = {
                                index : i,
                                ct : i + 1,
                                item : i == index ? arg.newValue : undefined
                            };
                            items[i] = itemParam;
                            this._initItem(itemParam);
                            sections[i - itemsLength] = this._createSectionParam(itemParam);
                        }
                        this.tplCtxt.insertAdjacentSections({
                            refSection : {
                                domElt : this.getDom(),
                                object : this
                            },
                            sections : sections,
                            position : "beforeEnd"
                        });
                    }
                } else if (change == jsonUtils.SPLICE) {
                    var index = arg.index;
                    var removedLength = arg.removed.length;
                    // removing items:
                    if (removedLength) {
                        for (var i = 0; i < removedLength; i++) {
                            var item = this.items[index + i];
                            var sectionWrapper = this.tplCtxt.$getElementById(item.sectionId);
                            sectionWrapper.remove();
                        }
                    }
                    // adding items:
                    var added = arg.added;
                    var addedLength = added.length;
                    if (addedLength) {
                        var sections = [];
                        var spliceParams = [index, removedLength];
                        for (var i = 0; i < addedLength; i++) {
                            var itemParam = {
                                index : index + i,
                                ct : index + i + 1,
                                item : added[i]
                            };
                            spliceParams[i + 2] = itemParam;
                            this._initItem(itemParam);
                            sections[i] = this._createSectionParam(itemParam);
                        }
                        items.splice.apply(items, spliceParams);
                        if (index > 0) {
                            var refSection = this.getSectionById(items[index - 1].sectionId);
                            this.tplCtxt.insertAdjacentSections({
                                refSection : {
                                    domElt : refSection.getDom(),
                                    object : refSection
                                },
                                sections : sections,
                                position : "afterEnd"
                            });
                        } else {
                            this.tplCtxt.insertAdjacentSections({
                                refSection : {
                                    domElt : this.getDom(),
                                    object : this
                                },
                                sections : sections,
                                position : "afterBegin"
                            });
                        }
                    } else {
                        items.splice(index, removedLength);
                    }
                    // updating remaining items:
                    if (addedLength != removedLength) {
                        this._updateRemainingItems(index + addedLength, true);
                    }
                }
            },

            _updateRemainingItems : function (beginIndex, updateIndex) {
                var items = this.items;
                var attributesCB = this._childSections.attributes;
                if (!_isCallback(attributesCB)) {
                    attributesCB = null;
                }
                for (var i = items.length - 1; i >= beginIndex; i--) {
                    var item = items[i];
                    if (updateIndex) {
                        // we do not update the index for maps, as the index is a key in that case
                        jsonUtils.setValue(item, "index", i);
                    }
                    jsonUtils.setValue(item, "ct", i + 1);
                    if (attributesCB) {
                        var section = this.getSectionById(item.sectionId);
                        section.updateAttributes(this.tplCtxt.evalCallback(attributesCB, item));
                    }
                }
            },

            _notifyChange_map : function (arg) {
                // NOTE: Due to the refresh manager, this method may be called some time after the modification happened
                // on the array, and several other modifications may have happened after that

                // maps are not ordered, adding an item is always done at the end
                var change = arg.change;
                if (change != jsonUtils.VALUE_CHANGED && change != jsonUtils.KEY_REMOVED
                        && change != jsonUtils.KEY_ADDED) {
                    return;
                }
                if (this._checkRefreshManager(arg)) {
                    return;
                }
                var itemsMap = this.itemsMap;
                var items = this.items;
                var iteratedSet = this.iteratedSet;
                var index = arg.dataName;
                if (jsonUtils.isMetadata(index)) {
                    // ignore meta data
                    return;
                }
                // check if the item is already displayed
                if (itemsMap.hasOwnProperty(index)) {
                    var item = itemsMap[index];
                    // already displayed
                    if (change == jsonUtils.KEY_REMOVED) {
                        // remove the item
                        var sectionWrapper = this.tplCtxt.$getElementById(item.sectionId);
                        sectionWrapper.remove();
                        items.splice(item.ct - 1, 1);
                        delete itemsMap[index];
                        this._updateRemainingItems(item.ct - 1, false);
                    } else {
                        // key added or changed
                        // update the item and refresh the corresponding section
                        jsonUtils.setValue(item, "item", iteratedSet[index]);
                        this.tplCtxt.$refresh({
                            section : item.sectionId
                        });
                    }
                } else if (change != jsonUtils.VALUE_CHANGED) {
                    // add the new item
                    var item = {
                        index : index,
                        ct : items.length + 1,
                        item : iteratedSet[index]
                    };
                    this._initItem(item);
                    items[item.ct - 1] = item;
                    this.tplCtxt.insertAdjacentSections({
                        refSection : {
                            domElt : this.getDom(),
                            object : this
                        },
                        sections : [this._createSectionParam(item)],
                        position : "beforeEnd"
                    });
                }
            },

            _updateLoopType : function () {
                var res = true;
                var value = this._loopType;
                var iteratedSet = this.iteratedSet;
                if (value == "array") {
                    res = typeUtils.isArray(iteratedSet);
                } else if (value == "map") {
                    res = typeUtils.isObject(iteratedSet);
                } else if (value != null) {
                    res = typeUtils.isInstanceOf(iteratedSet, 'aria.templates.View');
                    if (value == "view") {
                        value = "pagedView";
                    }
                } else {
                    // value is null
                    if (typeUtils.isArray(iteratedSet)) {
                        value = "array";
                    } else if (typeUtils.isInstanceOf(iteratedSet, 'aria.templates.View')) {
                        value = "pagedView";
                    } else if (typeUtils.isObject(iteratedSet)) {
                        value = "map";
                    } else {
                        res = false;
                    }
                    this._loopType = value;
                }
                if (!res) {
                    this.$logError(this.REPEATER_INVALID_ITERATED_SET, [this.tplCtxt.tplClasspath, this.id, value], iteratedSet);
                    return false;
                }
                if (value != "map" && value != "array") {
                    this.$logError(this.VIEWS_NOT_SUPPORTED, [this.tplCtxt.tplClasspath, this.id]);
                    return false;
                }
                this._loopOver = this["_loopOver_" + value];
                this._notifyChange = this["_notifyChange_" + value];
                return true;
            },

            writeContent : function (out) {
                this._loopOver(this.iteratedSet, this._writeRepeaterItem);
            }
        }
    });
})();
