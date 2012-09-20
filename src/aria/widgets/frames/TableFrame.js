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
 * A table frame is a frame which is based on the table tag. The width, as well as the height, can either be defined by
 * the frame configuration, or left undefined so that they are adapted to the content. The expansion in width and height
 * are done by repeating images horizontally and vertically.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.frames.TableFrame",
    $extends : "aria.widgets.frames.Frame",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function (cfg) {
        this.$Frame.constructor.call(this, cfg);

        this._baseId = cfg.id;

        this._computeSize();

        /**
         * Pointer to td element from the frame
         * @protected
         * @type Array
         */
        this._tds = null;
        /**
         * Specifies whether the table is an inline-block element
         * @type Boolean
         * @protected
         */
        this._inlineBlock = cfg.inlineBlock;
    },
    $statics : {},
    $destructor : function () {
        var tds = this._tds;
        if (tds) {
            for (var i = 0, l = tds.length; i < l; i++) {
                // remove dom links
                tds[i].element = null;
            }
            this._tds = null;
        }
        this.$Frame.$destructor.call(this);
    },
    $prototype : {
        /**
         * Fill the innerWidth and innerHeight properties.
         */
        _computeSize : function () {

            /*
             * FIXME propery: setting a CORRECT innerHeight makes the frame too big firefox fix : -2px negative margin
             * on inner span GOAL: proper outerWidth, with proper innerWidth, resize with current height and width must
             * not change the size.
             */

            var cfg = this._cfg, state = cfg.stateObject;
            if (cfg.width > -1) {
                var w = cfg.width - state.sprWidth - state.marginLeft - state.marginRight;
                this.innerWidth = w > 0 ? w : 0;
            } else {
                this.innerWidth = -1;
            }
            if (cfg.height > -1) {
                var h = cfg.height - state.sprHeight - state.marginTop - state.marginBottom;
                /*
                 * TODO: find why -7 is needed (where are these 7 pixels lost in IE?) especially test on IE8 if changing
                 * -7
                 */
                this.innerHeight = h > 0 ? h : 0;
            } else {
                this.innerHeight = -1;
            }

        },

        /**
         * Generate the begining of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            var cfg = this._cfg, cssPrefix = this._cssPrefix, state = cfg.stateObject;
            var frameContainerClass = (cfg.block !== true) ? ' ' : 'class="xBlock"';
            var sizeInfo = {
                style : '',
                /*
                 * TODO: the CSS class cssClass should not define any padding, margin or border for the frame to be
                 * correctly displayed
                 */
                className : 'xFrameContent ' + cssPrefix + 'c ' + cfg.cssClass
            };
            this._appendInnerWidthInfo(sizeInfo);
            this._appendInnerHeightInfo(sizeInfo);
            var displayInline = (this._inlineBlock) ? "display:inline-block;vertical-align: middle;" : "";
            out.write(['<table cellspacing="0" cellpadding="0" style="position: relative;' + displayInline + '"',
                    frameContainerClass, '><tbody isFrame="1">', '<tr>', '<td class="', cssPrefix, 'tlc ', cssPrefix,
                    'bkgA">&nbsp;</td>', '<td class="', cssPrefix, 'ts ', cssPrefix,
                    'bkgB">' + this.__addFrameIcon(cfg, cssPrefix, 'top') + '</td>', '<td class="', cssPrefix, 'trc ',
                    cssPrefix, 'bkgA">&nbsp;</td>', '</tr>', '<tr>', '<td class="', cssPrefix, 'ls ', cssPrefix,
                    'bkgC">&nbsp;</td>', '<td class="', cssPrefix, 'm">', '<span ',
                    Aria.testMode && this._baseId ? ' id="' + this._baseId + '"' : '',
                    (sizeInfo.style ? 'style="' + sizeInfo.style + '"' : ''), ' class="', sizeInfo.className, '">'].join(''));
        },

        /**
         * Generate the end of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {
            var cfg = this._cfg, sclass = cfg.sclass, cssPrefix = this._cssPrefix;
            out.write(['</span></td>', '<td class="', cssPrefix, 'rs ', cssPrefix, 'bkgC">&nbsp;</td>', '</tr>',
                    '<tr>', '<td class="', cssPrefix, 'blc ', cssPrefix, 'bkgA">&nbsp;</td>', '<td class="', cssPrefix,
                    'bs ', cssPrefix, 'bkgB">', this.__addFrameIcon(cfg, cssPrefix, 'bottom'), '</td>', '<td class="',
                    cssPrefix, 'brc ', cssPrefix, 'bkgA">&nbsp;</td>', '</tr>', '</tbody></table>'].join(''));

        },

        /**
         * Link this frame to a DOM element after the markup has been inserted in the DOM.
         * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
         * writeMarkupBegin method.
         */
        linkToDom : function (domElt) {
            this.$Frame.linkToDom.call(this, domElt);
            var getDomElementChild = aria.utils.Dom.getDomElementChild;
            /*
             * FIXME: extend getDomElementChild API to have getDomElementChild(domElt,0,1,1,0) instead
             */
            this._childRootElt = getDomElementChild(getDomElementChild(getDomElementChild(getDomElementChild(domElt, 0), 1), 1), 0);
        },

        /**
         * Generate markup for frameIcon (additional image added at the top or the bottom, used by errortooltip)
         * @param {Object} cfg
         * @param {String} cssPrefix
         * @param {String} position
         */
        __addFrameIcon : function (cfg, cssPrefix, position) {
            var stateObject = cfg.stateObject;
            var frameIconVPos = stateObject.frameIconVPos;
            if (stateObject.frameIcon && frameIconVPos == position) {
                return '<span class="' + cssPrefix + 'frameIcon">&nbsp;</span>';
            }
            return "&nbsp";
        },
        /**
         * Change the state of the frame. Must not be called before linkToDom has been called.
         * @param {String} stateName name of the state
         */
        changeState : function (stateName) {
            this.$Frame.changeState.call(this, stateName); // this must be
            // called before
            // assigning
            // cssPrefix
            var cfg = this._cfg, cssPrefix = this._cssPrefix, tr, td, getDomElementChild = aria.utils.Dom.getDomElementChild;

            this._computeSize();

            var tds = this._tds;
            if (!tds) {
                tds = [];
                this._tds = tds;
                var tbody = getDomElementChild(this._domElt, 0);
                // Line 1
                tr = getDomElementChild(tbody, 0);
                td = getDomElementChild(tr, 0);
                tds.push({
                    element : td,
                    cssPart1 : 'tlc ',
                    cssPart2 : 'bkgA'
                });
                td = getDomElementChild(tr, 1);
                tds.push({
                    element : td,
                    cssPart1 : 'ts ',
                    cssPart2 : 'bkgB'
                });
                td = getDomElementChild(tr, 2);
                tds.push({
                    element : td,
                    cssPart1 : 'trc ',
                    cssPart2 : 'bkgA'
                });
                // Line 2
                tr = getDomElementChild(tbody, 1);
                td = getDomElementChild(tr, 0);
                tds.push({
                    element : td,
                    cssPart1 : 'ls ',
                    cssPart2 : 'bkgC'
                });
                td = getDomElementChild(tr, 1);
                tds.push({
                    element : td,
                    cssPart : 'm'
                });
                td = getDomElementChild(tr, 2);
                tds.push({
                    element : td,
                    cssPart1 : 'rs ',
                    cssPart2 : 'bkgC'
                });
                // Line 3
                tr = getDomElementChild(tbody, 2);
                td = getDomElementChild(tr, 0);

                tds.push({
                    element : td,
                    cssPart1 : 'blc ',
                    cssPart2 : 'bkgA'
                });
                td = getDomElementChild(tr, 1);
                tds.push({
                    element : td,
                    cssPart1 : 'bs ',
                    cssPart2 : 'bkgB'
                });

                td = getDomElementChild(tr, 2);

                tds.push({
                    element : td,
                    cssPart1 : 'brc ',
                    cssPart2 : 'bkgA'

                });

            }

            var sizeInfo = {
                className : 'xFrameContent ' + cssPrefix + 'c ' + cfg.cssClass
            };
            this._appendInnerWidthInfo(sizeInfo);
            this._appendInnerHeightInfo(sizeInfo);
            this._childRootElt.style.width = sizeInfo.width;
            this._childRootElt.style.height = sizeInfo.height;
            this._childRootElt.className = sizeInfo.className;

            for (var i = 0, l = tds.length; i < l; i++) {
                td = tds[i];
                if (td.cssPart) {
                    td.element.className = cssPrefix + 'm';
                } else {
                    td.element.className = cssPrefix + td.cssPart1 + cssPrefix + td.cssPart2;
                }
                // frameIcons update
                if (i == 1) {
                    td.element.innerHTML = this.__addFrameIcon(cfg, cssPrefix, 'top');
                }
                if (i == 7) {
                    td.element.innerHTML = this.__addFrameIcon(cfg, cssPrefix, 'bottom');
                }
            }
        },

        /**
         * Resize the frame to new dimensions.
         * @param {Number} width New width, or -1 to fit the content width
         * @param {Number} height New height, or -1 to fit the content height
         */
        resize : function (width, height) {
            this.$Frame.resize.call(this, width, height);
            this.changeState(this.getStateName());
        }
    }
});
