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
 * Handle keyboard navigation and shortcut for a given section.
 * @class aria.templates.NavigationManager
 */
Aria.classDefinition({
    $classpath : "aria.templates.NavigationManager",
    $singleton : true,
    $dependencies : ["aria.utils.Type", "aria.templates.CfgBeans"],
    $constructor : function () {
        /**
         * Marker used to tag the event, to notify if table navigation has already been done.
         * @protected
         * @type String
         */
        this._tableNavMarker = Aria.FRAMEWORK_PREFIX + "tableNavDone";

        /**
         * Marker used to tag the event, to notify if key map handling has already been done.
         * @protected
         * @type String
         */
        this._keyMapMarker = Aria.FRAMEWORK_PREFIX + "keyMapDone";

        /**
         * List of keymaps defined at window level.
         * @type Array containing objects of type aria.templates.CfgBeans.GlobalKeyMapCfg
         */
        this.globalKeyMap = [];

        /**
         * Flag that indicates that non-modal global keymaps have to be ignored
         * @type Boolean
         * @protected
         */
        this._hasModalBehaviour = false;
    },
    $statics : {
        INVALID_GLOBAL_KEYMAP_CFG : "Invalid global keymap configuration."
    },
    $prototype : {

        /**
         * Add a key map at window level
         * @param {aria.templates.CfgBeans:GlobalKeyMapCfg}
         */
        addGlobalKeyMap : function (configuration) {
            var normalizeCfg = {
                json : configuration,
                beanName : "aria.templates.CfgBeans.GlobalKeyMapCfg"
            };
            if (aria.core.JsonValidator.normalize(normalizeCfg)) {
                configuration = normalizeCfg.json;
                this.globalKeyMap.unshift(configuration);
            } else {
                this.$logError(this.INVALID_GLOBAL_KEYMAP_CFG);
            }

        },

        /**
         * Remove a key map at window level
         * @param {Object} configuration
         *
         * <pre>
         * {
         *         key: 'A',
         *         ctrl : true,
         *         shift: true,
         *         alt : true
         * }
         * </pre>
         *
         * @return {Boolean} true if success
         */
        removeGlobalKeyMap : function (configuration) {
            for (var index = 0, l = this.globalKeyMap.length, mapConfig; index < l; index++) {
                mapConfig = this.globalKeyMap[index];
                if (mapConfig.key == configuration.key && (!!configuration.modal == !!mapConfig.modal)
                        && (!!configuration.alt == !!mapConfig.alt) && (!!configuration.shift == !!mapConfig.shift)
                        && (!!configuration.ctrl == !!mapConfig.ctrl)) {
                    this.globalKeyMap.splice(index, 1);
                    return true;
                }
            }
            return false;
        },

        /**
         * Handle navigation for a given section. This "tags" the event to ensure that the behaviour is only done once.
         * @param {Object} keyMap keyboard shortcuts configuration
         * @param {Object} tableNav table navigation configuration
         * @param {aria.DomEvent} event
         */
        handleNavigation : function (keyMap, tableNav, event, keyMapOnly) {
            if (event.type == "keyup" || event.type == "keydown") {
                // handle table navigation if not already done
                if (!event[this._tableNavMarker] && event.type == "keydown") {
                    event[this._tableNavMarker] = this._handleTableNavigation(tableNav, event);
                }
                if (!event[this._keyMapMarker]) {
                    event[this._keyMapMarker] = this._handleKeyMap(keyMap, event);
                }
            }
        },

        /**
         * Handle navigation happening at window level, and define on the globalKeyMap property
         * @param {aria.DomEvent} event
         */
        handleGlobalNavigation : function (event) {
            if (event.type == "keyup" || event.type == "keydown") {
                if (!event[this._keyMapMarker]) {
                    event[this._keyMapMarker] = this._handleKeyMap(this.globalKeyMap, event, true);
                }
            }
        },

        // FOCUS HANDLING

        /**
         * Find first focusable element in container, and return false if not found
         * @param {HTMLElement} container
         * @param {Boolean} reverse look backward. default is false
         * @return {Boolean}
         */
        focusFirst : function (container, reverse) {
            var cb;
            if (container.nodeType == 1) {
                var childNodes = container.childNodes, length = childNodes.length, index = reverse ? length - 1 : 0, child;
                for (; index > -1 && index < length; reverse ? index-- : index++) {
                    child = childNodes[index];
                    // PTR 04634723 - the callback is provided for the case in which we try to set the focus on a
                    // subtemplate which is not ready and cannot return true/false after focus success/failure. This
                    // callback is called in the listener defined in the focus method of the template widget in case the
                    // template is not ready
                    cb = {
                        fn : function () {
                            this._focusNext(child, reverse);
                        },
                        scope : this
                    };
                    if (this._doFocus(child, cb)) {
                        return true;
                    }
                    if (this.focusFirst(child, reverse)) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        },

        /**
         * Set the modal behaviour. When value is equal to true, non-modal global keymaps will be ignored
         * @param {Boolean} default is false
         */
        setModalBehaviour : function (value) {
            this._hasModalBehaviour = value;
        },
        /**
         * Focus the next element in the dom after / before current element
         * @protected
         * @param {HTMLElement} target
         * @param {Boolean} reverse look backward. default is false
         * @return {Boolean} true if something get focused
         */
        _focusNext : function (target, reverse) {
            var body = Aria.$window.document.body;
            var next;
            // find next node to inspect : either a sibling, or a parent sibling, ...
            while (!next) {
                if (!reverse) {
                    next = target.nextSibling;
                } else {
                    next = target.previousSibling;
                }
                if (!next) {
                    target = target.parentNode;
                    if (!target || target == body) {
                        return false;
                    }
                }
            }

            // look in the need for the first to focus. If not : continue
            if (!(this._doFocus(next) || this.focusFirst(next, reverse))) {
                return this._focusNext(next, reverse);
            } else {
                return true;
            }
        },

        /**
         * Check if element can be focused and focus it if possible
         * @protected
         * @param {HTMLElement} target
         * @param {aria.core.CfgBeans:Callback} cb callback to pass over to the focus method of widgets
         * @return {Boolean} true if focus can be made
         */
        _doFocus : function (target, cb) {
            // text node -> cannot be focused
            if (target.nodeType != 1) {
                return false;
            }
            // case existing widget
            if (target.__widget) {
                if (target.__widget.focus) {
                    var focusSuccess = target.__widget.focus(null, cb);
                    // PTR 04634723 - the focus method of the template widget returns a boolean value that represents
                    // the success/failure of the focus.
                    // Note 30.10.2012: I refactored from return (focusSuccess==false) ? false:true
                    // It seems that false is returned from 'focus' method in case of failure, and undefined (*not*
                    // true, as stated above!) otherwise. So logically, seems there should be === false comparison here,
                    // but the code seems to be working fine...
                    return !!focusSuccess;
                } else {
                    return false;
                }
            } else {
                var nodeName = target.nodeName, tabIndex = target.getAttributeNode("tabindex");
                if ((nodeName == "INPUT" || nodeName == "TEXTAREA" || nodeName == "A" || nodeName == "BUTTON" || (tabIndex
                        && tabIndex.specified && tabIndex.nodeValue != -1))
                        && !target.disabled) {
                    try {
                        target.focus();
                        return true;
                    } catch (e) {
                        // this happens in IE if the element is disable or hidden
                        return false;
                    }
                }
            }
            return false;
        },

        // TABLE NAVIGATION

        /**
         * Handle table navigation for the incoming event and with given configuration
         * @protected
         * @param {Object} tableNav
         * @param {aria.DomEvent} event
         * @return {Boolean} true if table navigation has been done, and must not be done by a parent section
         */
        _handleTableNavigation : function (tableNav, event) {

            var keyCode = event.keyCode, hasFocus = false;

            // case false or wrong key: cancel table navigation
            if (tableNav === false || keyCode > 40 || keyCode < 37) {
                return true;
            }

            // no configuration set, and not false : parent section handle this
            if (!tableNav) {
                return false;
            }

            // case true : no modifier
            if (tableNav === true) {
                tableNav = {};
            }

            // check modifiers
            var validModifier = this._validateModifiers(tableNav, event);

            if (validModifier) {
                var focus = event.target;
                var containingTD = this._getContainingTD(focus);
                // real table navigation
                if (containingTD) {
                    var containingTbody = containingTD.parentNode.parentNode;
                    var mapAndPos = this._getTableMap(containingTbody, containingTD);
                    hasFocus = this._navigateMap(containingTbody, mapAndPos, event);
                } else {
                    // simulate TAB and shift-TAB
                    if (keyCode == event.KC_ARROW_DOWN) {
                        hasFocus = this._focusNext(focus);
                    } else if (keyCode == event.KC_ARROW_UP) {
                        hasFocus = this._focusNext(focus, true);
                    }
                }
                if (hasFocus) {
                    // focus has changed successfully : prevent default
                    event.preventDefault();
                }
                // table nav handled
                return true;
            }

        },

        /**
         * Validates an event against a configuration
         * @param {Object} config
         * @param {aria.DomEvent} event
         */
        _validateModifiers : function (config, event) {
            return (event.altKey == !!config.alt) && (event.shiftKey == !!config.shift)
                    && (event.ctrlKey == !!config.ctrl);
        },

        /**
         * Navigate a TBODY described by a map, for a given keyCode
         * @protected
         * @param {HTMLElement} containingTbody
         * @param {Object} mapAndPos
         * @param {Number} keyCode
         * @return {Boolean} true if focus has been done
         */
        _navigateMap : function (containingTbody, mapAndPos, event) {

            var keyCode = event.keyCode;

            // this maps gives the cell and row index for each "cell" of the table, considering that a td with
            // rowspan equal to 3 is 3 cells one above the other
            var cellMap = mapAndPos.map;

            // cellPos is position of top left of the cell
            var cellPos = mapAndPos.pos;

            var rowShift = 0, cellShift = 0;
            // get the appropriate modifier to find next cell depending on the keycode. This gives the direction
            // in the map
            if (keyCode == event.KC_ARROW_UP) {
                rowShift = -1;
            } else if (keyCode == event.KC_ARROW_DOWN) {
                rowShift = 1;
            } else if (keyCode == event.KC_ARROW_LEFT) {
                cellShift = -1;
            } else { // right
                cellShift = 1;
            }

            var hasFocus = false, currentPos = cellPos, nextRowPos, nextCell, nextPos, skip;
            var nextRowIndex = cellPos.rowIndex, nextCellIndex = cellPos.mapCellIndex;

            do {
                // retrieve next position IN MAP according to given direction described in modifier.
                // if cellShift AND rowShit are not null, we are looking in a given line for a focusable cell
                // for a VERTICAL navigation
                if (cellShift !== 0) {
                    nextCellIndex = nextCellIndex + cellShift;
                } else {
                    nextRowIndex = nextRowIndex + rowShift;
                }

                // console.log("NEXT: " + nextCellIndex + " - " + nextRowIndex);

                // unvalid value means there is nowhere else to go
                if (nextRowIndex < 0 || nextRowIndex >= cellMap.length) {
                    return this._focusNext(containingTbody, nextRowIndex < 0);
                }
                nextRowPos = cellMap[nextRowIndex];

                // skip will be called if after checking limits, we can determine a new start position
                skip = false;
                if (nextCellIndex < 0 || nextCellIndex >= nextRowPos.length) {
                    // vertical navigation, horizontal adjustement
                    if (rowShift !== 0) {
                        // was going right, but found nothing : go left
                        if (cellShift == 1) {
                            cellShift = -1;
                            nextCellIndex = cellPos.mapCellIndex;
                        } else {
                            // went left, found nothing : go to next line
                            cellShift = 1;
                            nextCellIndex = cellPos.mapCellIndex - 1;
                            nextRowIndex = nextRowIndex + rowShift;
                        }
                        skip = true;
                    } else {
                        // standard horizontal navigation
                        return false;
                    }
                }

                if (!skip) {
                    nextPos = cellMap[nextRowIndex][nextCellIndex];

                    // check that the cell Id has changed : if so, that a new cell, focus it
                    if (nextPos != currentPos) {

                        // case horizontal scrolling for vertical navigation : can only use this cells if this
                        // is the top of a cell when going done, or the bottom of a cell when going up
                        if (rowShift !== 0 && cellShift !== 0) {

                            if (rowShift == -1 && nextPos.rowIndex + nextPos.rowSpan - 1 != nextRowIndex) {
                                // this is not the bottom of a cell
                                skip = true;
                            } else if (rowShift == 1 && nextPos.rowIndex != nextRowIndex) {
                                // this is not the top of a cell
                                skip = true;
                            }
                        }

                        if (!skip) {
                            // retrieve real next cell and tries to focus it
                            nextCell = containingTbody.rows[nextPos.rowIndex].cells[nextPos.cellIndex];
                            currentPos = nextPos;
                            if (nextCell) {
                                hasFocus = this.focusFirst(nextCell);
                                // gone vertical, new cell found, not focusable : activate horizontal
                                if (!hasFocus && rowShift !== 0 && cellShift === 0) {
                                    cellShift = 1;
                                }

                            } else {
                                // something has gone wrong?
                                return false;
                            }
                        }
                    }
                }
            } while (!hasFocus);

            // focus has been done successfully : return true
            return true;
        },

        /**
         * Find if element is in a TD tag, not beeing a td generated by the framework. If so, return the table.
         * @protected
         * @param {HTMLElement} focus
         * @return {HTMLElement}
         */
        _getContainingTD : function (focus) {
            var body = Aria.$window.document.body;
            var parent = focus;
            while (parent && parent != body) {
                if (parent.nodeName == "TD") {
                    // check that this is not a table frame : there is a isFrame on the TBODY of the table frame
                    if (!parent.parentNode.parentNode.attributes['isFrame']) {
                        return parent;
                    }
                }
                parent = parent.parentNode;
            }
            return;
        },

        /**
         * Generates double array of cell position from a table body, in order to deal with colspan and rowspan. Also
         * provide the cell position of target cell.
         * @protected
         * @param {HTMLElement} tbody
         * @param {HTMLElement} targetCell
         * @return {Object}
         *
         * <pre>
         *     {
         *         map : ...,
         *         pos : ...
         *  }
         * </pre>
         */
        _getTableMap : function (tbody, targetCell) {
            var rowsMap = [], targetPos, rows = tbody.rows;

            for (var rowIndex = 0, l = rows.length; rowIndex < l; rowIndex++) {

                var cells = rows[rowIndex].cells;
                // initialize map of cells
                var cellsMap = rowsMap[rowIndex];
                if (!cellsMap) {
                    cellsMap = [];
                    rowsMap[rowIndex] = cellsMap;
                }

                var mapCellIndex = 0;

                for (var cellIndex = 0, l2 = cells.length; cellIndex < l2; cellIndex++) {
                    var cell = cells[cellIndex];
                    var rowSpan = cell.rowSpan;
                    var colSpan = cell.colSpan;

                    // determine first available place for top left corner
                    var content = cellsMap[mapCellIndex];
                    while (content) {
                        content = cellsMap[++mapCellIndex];
                    }

                    var cellId = {
                        rowIndex : rowIndex,
                        cellIndex : cellIndex,
                        rowSpan : rowSpan,
                        mapCellIndex : mapCellIndex
                    };

                    if (cell == targetCell) {
                        // record position
                        targetPos = cellId;
                    }

                    for (var rowShift = 0; rowShift < rowSpan; rowShift++) {
                        var nextCellsMap = rowsMap[rowIndex + rowShift];
                        if (!nextCellsMap) {
                            nextCellsMap = [];
                            rowsMap[rowIndex + rowShift] = nextCellsMap;
                        }

                        for (var colShift = 0; colShift < colSpan; colShift++) {
                            nextCellsMap[mapCellIndex + colShift] = cellId;
                        }
                    }

                    mapCellIndex += colSpan;

                }
            }
            return {
                map : rowsMap,
                pos : targetPos
            };
        },

        // KEYMAP NAVIGATION

        /**
         * Handle incoming keyMap
         * @param {Object} keyMap
         * @param {aria.DomEvent} event
         * @param {Boolean} global true if the method has to deal with global keymaps
         * @return {Boolean} true is event was handled and callback did not returned true
         */
        _handleKeyMap : function (keyMap, event, global) {

            var keyCode = event.keyCode, bubble = false, found = false, wildCard, keyMapEvent;
            if (!keyMap || !keyCode) {
                return false;
            }

            // TODO: check configuration

            for (var index = 0, mapConfig; mapConfig = keyMap[index]; index++) {
                if (this._validateModifiers(mapConfig, event)) {
                    keyMapEvent = (mapConfig && "event" in mapConfig) ? mapConfig["event"] : "keydown";

                    if (!mapConfig.key || keyMapEvent != event.type) {
                        return false;
                    }
                    // if the method has been called for a gloabal navigation, ignore non-modal keymaps when the modal
                    // behaviour is activated
                    if (global === true && this._hasModalBehaviour && !mapConfig.modal) {
                        continue;
                    }

                    // case real key defined
                    if (aria.utils.Type.isNumber(mapConfig.key)) {
                        if (mapConfig.key == keyCode) {
                            bubble = this.$callback(mapConfig.callback);
                            found = true;
                            break;
                        }
                    } else if (mapConfig.key !== "*") {
                        // case not a wild card
                        if (event["KC_" + mapConfig.key.toUpperCase()] == keyCode) {
                            bubble = this.$callback(mapConfig.callback);
                            found = true;
                            break;
                        }
                    } else {
                        // store wild card : it has less priority than other key and won't be called if another key
                        // is defined
                        wildCard = mapConfig.callback;
                    }
                }
            }

            if (!found) {
                if (wildCard) {
                    return !this.$callback(wildCard);
                } else {
                    // nothing found, no wildcard
                    return false;
                }
            } else {
                // something found, no bubbling : prevent default
                if (!bubble) {
                    event.preventDefault();
                    return true;
                }
                return false;
            }
        }
    }
});
