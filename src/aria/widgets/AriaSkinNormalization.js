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
 * Skin normalization utility.
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.AriaSkinNormalization',
    $dependencies : ['aria.core.JsonValidator', 'aria.widgets.AriaSkinBeans', 'aria.utils.InheritanceNormalization',
            'aria.utils.FunctionWriter', 'aria.utils.Function'],
    $singleton : true,
    $constructor : function () {
        /**
         * Widget normalizers. Keys in this object are widget names.
         * @type Object
         */
        this._widgetNormalizers = {};

        /**
         * Frame normalizers. Keys in this object are frame types.
         * @type Object
         */
        this._frameNormalizers = {};

        /**
         * Constructor for normalizers (both widget and frame normalizers).
         * @type Function
         */
        this._createNormalizerObject = function () {};

        // Prototype used by all normalizers
        var normalizerPrototype = {
            normFrame : aria.utils.Function.bind(this._normFrame, this),
            checkFrameState : aria.utils.Function.bind(this._checkFrameState, this)
        };
        this._createNormalizerObject.prototype = normalizerPrototype;
    },
    $destructor : function () {
        this._widgetNormalizers = null;
        if (this._createNormalizerObject) {
            this._createNormalizerObject.prototype = null;
        }
        this._createNormalizerObject = null;
    },
    $statics : {
        MISSING_STD_SKINCLASS : "There is no skin configuration for skin class std of widget %1. The widget will probably not be displayed correctly.",
        INVALID_FRAME_TYPE : "Frame type %3 is not valid in widget %1, skin class %2.",
        INVALID_SKINNABLE_CLASS : "Skinnable class %1 is not valid",
        FRAME_NORMALIZATION_ERROR : "Error while normalizing the frame part of widget %1, skin class %2:\n %3",
        FRAME_STATE_NORMALIZATION_ERROR : "Error while normalizing the frame part of widget %1, skin class %2, state %3:\n %4",
        WIDGET_NORMALIZATION_ERROR : "Error while normalizing widget %1:\n %2",
        GENERAL_NORMALIZATION_ERROR : "Error while normalizing general skin properties:\n %1",

        DEPRECATED_FRAME_TYPE : "The frame type %1, used in widget %2, skin class %3, is deprecated. Please use either Table, FixedHeight, SimpleHTML or Simple."
    },
    $prototype : {
        /**
         * Available frame types. It is used to convert the integer sprite type (index in this array) into the
         * corresponding string.
         * @type Array
         */
        _frameTypes : [
                /* 0 */"Old0",
                /* 1 */"Old1",
                /* 2 */"Old2",
                /* 3 */"Table",
                /* 4 */"FixedHeight",
                /* 5 */"SimpleHTML",
                /* 6 */"Simple"],

        /**
         * Available skinnable classes.
         * @type Map
         */
        skinnableClasses : {
            "Button" : 1,
            "Calendar" : 1,
            "List" : 1,
            "Link" : 1,
            "Gauge" : 1,
            "RadioButton" : 1,
            "CheckBox" : 1,
            "DatePicker" : 1,
            "SelectBox" : 1,
            "Textarea" : 1,
            "ErrorList" : 1,
            "Fieldset" : 1,
            "MultiSelect" : 1,
            "Select" : 1,
            "SortIndicator" : 1,
            "Splitter" : 1,
            "Icon" : 1,
            "Div" : 1,
            "Dialog" : 1,
            "TextInput" : 1,
            "AutoComplete" : 1,
            "TabPanel" : 1,
            "Tab" : 1
        },

        /**
         * Normalizes the frame properties for a skin class and returns the function which normalizes each frame state.
         * This method is called for skin classes of widgets which use a frame.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @param {String} skinClassName skin class name
         * @param {Object} skin skin class to normalize
         * @param {Object} std std skin class
         * @return {Function}
         */
        _normFrame : function (widgetName, skinClassName, skin, std) {
            // must return the normalizer for the frame state
            // get the frame type
            if (skin.frame == null) {
                skin.frame = {};
            }
            var skinFrame = skin.frame;
            std = std || {};
            var stdFrame = std.frame || {};
            var frameType;
            var defaultFrameType = "Simple";
            if (skin.simpleHTML) {
                frameType = "SimpleHTML";
            } else {
                var possibleValues = [skinFrame.frameType || skinFrame.sprType, skin.sprType,
                        stdFrame.frameType || stdFrame.sprType, std.sprType, defaultFrameType /* default */];
                for (var i = 0, l = possibleValues.length; i < l; i++) {
                    if (possibleValues[i] != null) {
                        frameType = possibleValues[i];
                        break;
                    }
                }
                if (aria.utils.Type.isNumber(frameType)) {
                    frameType = this._frameTypes[frameType];
                }
            }
            var frameNormalizers = this._getFrameNormalizers(widgetName, skinClassName, frameType);
            if (frameNormalizers == null) {
                // wrong frame type, use the default instead
                frameType = defaultFrameType;
                frameNormalizers = this._getFrameNormalizers(widgetName, skinClassName, frameType);
            }
            skinFrame.frameType = frameType;
            frameNormalizers.normFrameSkinClass(skin, std);
            if (Aria.debug) {
                if (/^Old/.test(frameType)) {
                    this.$logWarn(this.DEPRECATED_FRAME_TYPE, [frameType, widgetName, skinClassName]);
                }
                var res = this._check(skinFrame, 'aria.widgets.AriaSkinBeans.' + frameType + 'FrameCfg');
                if (!res.result) {
                    this.$logWarn(this.FRAME_NORMALIZATION_ERROR, [widgetName, skinClassName,
                            res.message.replace(/\n/g, "\n ")]);
                }
            }
            return frameNormalizers.normFrameState;
        },

        /**
         * Checks a frame state according to its bean, and logs an error message in case there is an issue.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @param {String} skinClassName
         * @param {String} stateName
         * @param {Object} stateFrame
         * @param {Object} beanName
         */
        _checkFrameState : function (widgetName, skinClassName, stateName, stateFrame, beanName) {
            var res = this._check(stateFrame, beanName);
            if (!res.result) {
                this.$logWarn(this.FRAME_STATE_NORMALIZATION_ERROR, [widgetName, skinClassName, stateName,
                        res.message.replace(/\n/g, "\n ")]);
            }
        },

        /**
         * Get the normalizer object for the given frame type. It is created if it does not exist already.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @param {String} skinClassName skin class name
         * @param {String} frameType frame type
         */
        _getFrameNormalizers : function (widgetName, skinClassName, frameType) {
            var res = this._frameNormalizers[frameType];
            if (res == null) {
                var frameBeanDef = aria.core.JsonValidator.getBean('aria.widgets.AriaSkinBeans.' + frameType
                        + 'FrameCfg');
                if (frameBeanDef == null) {
                    this.$logError(this.INVALID_FRAME_TYPE, [widgetName, skinClassName, frameType]);
                    return null;
                }
                res = {
                    normFrameSkinClass : this._createFrameNormalizer(frameType, frameBeanDef),
                    normFrameState : this._createFrameStateNormalizer(frameType, 'aria.widgets.AriaSkinBeans.'
                            + frameType + 'FrameStateCfg')
                };
                this._frameNormalizers[frameType] = res;
            }
            return res;
        },

        /**
         * Normalizes the skin, if not already done.
         * @param {Object} Skin object
         */
        normalizeSkin : function (skinObject) {
            if (skinObject['aria:skinNormalized']) {
                return;
            }
            for (var widget in skinObject) {
                if (skinObject.hasOwnProperty(widget) && widget != "general") {
                    skinObject[widget] = this.normalizeWidget(widget, skinObject[widget]);
                }
            }
            skinObject.general = this.normalizeGeneral(skinObject.general);
            skinObject['aria:skinNormalized'] = true;
            return skinObject;
        },

        /**
         * Create a normalizer function for a widget.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @param {Object} beanDef bean definition of the widget
         * @return {Function}
         */
        _createSkinClassNormalizer : function (widgetName, beanDef) {
            if (widgetName == "Icon") {
                // no inheritance, use usual normalization
                return function (skinClassName, skin, std) {
                    beanDef.$fastNorm(skin);
                };
            }
            var hasFrame = (beanDef.$properties.frame != null);
            var writer = new aria.utils.FunctionWriter(["skinClassName", "skin", "std"]);
            aria.utils.InheritanceNormalization.writeInheritanceNormalization({
                writer : writer,
                beanDef : beanDef,
                varToNormalize : "skin",
                parentVars : ["std"],
                excludes : {
                    "states" : true,
                    "frame" : true
                }
            });
            if (hasFrame) {
                // uses a frame, let's normalize it
                var frameStateNormalizerVar = writer.createTempVariable("this.normFrame(this.widgetName,skinClassName,skin,std)");
            }
            var states = beanDef.$properties.states;
            if (states) {
                states = states.$properties;
                writer.writeEnsureObjectExists("skin.states");
                var skinStatesVar = writer.createTempVariable("skin.states");
                var stdStatesVar = writer.createTempVariable("std.states||{}");
                var out = writer.out;
                for (var curState in states) {
                    if (states.hasOwnProperty(curState) && curState != "normal") {
                        var dotState = writer.getDotProperty(curState);
                        writer.writeEnsureObjectExists(skinStatesVar + dotState);
                        out.push("this.normState(", skinStatesVar, dotState, ",", stdStatesVar, dotState, ",", skinStatesVar, ".normal,", stdStatesVar, ".normal);");
                        if (hasFrame) {
                            // uses a frame, let's normalize it
                            out.push(frameStateNormalizerVar, ".call(this,skinClassName,", writer.stringify(curState), ",", skinStatesVar, dotState, ",", stdStatesVar, dotState, ",", skinStatesVar, ".normal, ", stdStatesVar, ".normal);");
                        }
                    }
                }
                writer.writeEnsureObjectExists(skinStatesVar + ".normal");
                out.push("this.normState(", skinStatesVar, ".normal, ", stdStatesVar, ".normal);");
                if (hasFrame) {
                    // uses a frame, let's normalize it
                    out.push(frameStateNormalizerVar, '.call(this,skinClassName,"normal",', skinStatesVar, '.normal,', stdStatesVar, '.normal);');
                }

            }
            var res = writer.createFunction();
            writer.$dispose();
            return res;
        },

        /**
         * Create a state normalizer function for a widget.
         * @param {String} widgetName
         * @param {Object} beanDef
         * @return {Function}
         */
        _createStateNormalizer : function (widgetName, beanDef) {
            var states = beanDef.$properties.states;
            if (states == null) {
                return null;
            }
            var writer = new aria.utils.FunctionWriter(["state", "stdState", "normal", "stdNormal"]);
            aria.utils.InheritanceNormalization.writeInheritanceNormalization({
                writer : writer,
                beanDef : states.$properties.normal,
                varToNormalize : "state",
                parentVars : ["stdState", "normal", "stdNormal"],
                excludes : {
                    "frame" : true
                }
            });
            var res = writer.createFunction();
            writer.$dispose();
            return res;
        },

        /**
         * Create the state normalizer function for a frame type.
         * @param {String} frameType
         * @param {String} beanName
         * @return {Function}
         */
        _createFrameStateNormalizer : function (frameType, beanName) {
            var beanDef = aria.core.JsonValidator.getBean(beanName);
            var writer = new aria.utils.FunctionWriter(["skinClassName", "stateName", "state", "stdState", "normal",
                    "stdNormal"]);
            writer.writeEnsureObjectExists("state.frame");
            writer.writeEnsureObjectExists("stdState");
            writer.writeEnsureObjectExists("normal");
            writer.writeEnsureObjectExists("stdNormal");
            aria.utils.InheritanceNormalization.writeInheritanceNormalization({
                writer : writer,
                beanDef : beanDef,
                varToNormalize : "state.frame",
                parentVars : ["state", "stdState.frame", "stdState", "normal.frame", "normal", "stdNormal.frame",
                        "stdNormal"]
            });

            // remove properties from the direct object in case they are present
            var properties = beanDef.$properties;
            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    writer.out.push("delete state", writer.getDotProperty(propName), ";");
                }
            }
            if (Aria.debug) {
                writer.out.push("this.checkFrameState(this.widgetName,skinClassName,stateName,state.frame,", writer.stringify(beanName), ");");
            }
            var res = writer.createFunction();
            writer.$dispose();
            return res;
        },

        /**
         * Create the normalizer function for a frame type.
         * @param {String} frameType
         * @param {Object} beanDef
         * @return {Function}
         */
        _createFrameNormalizer : function (frameType, beanDef) {
            var writer = new aria.utils.FunctionWriter(["skin", "std"]);
            var out = writer.out;
            // writer.writeEnsureObjectExists("skin.frame"); // not necessary, already done by normFrame
            // writer.writeEnsureObjectExists("std"); // not necessary, already done by normFrame
            aria.utils.InheritanceNormalization.writeInheritanceNormalization({
                writer : writer,
                beanDef : beanDef,
                varToNormalize : "skin.frame",
                parentVars : ["skin", "std.frame", "std"]
            });
            // remove properties from the direct object in case they are present
            var properties = beanDef.$properties;
            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    out.push("delete skin", writer.getDotProperty(propName), ";");
                }
            }
            var res = writer.createFunction();
            writer.$dispose();
            return res;
        },

        /**
         * Returns a normalizer object (with two methods normSkinClass and normState) for the given widget name. This
         * object is created if it does not exist already.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @return {Object}
         */
        _getWidgetNormalizer : function (widgetName) {
            var res = this._widgetNormalizers[widgetName];
            if (!res) {
                var beanDef = aria.core.JsonValidator.getBean('aria.widgets.AriaSkinBeans.' + widgetName + 'Cfg');
                res = new this._createNormalizerObject();
                res.widgetName = widgetName;
                res.normSkinClass = this._createSkinClassNormalizer(widgetName, beanDef);
                res.normState = this._createStateNormalizer(widgetName, beanDef);
                this._widgetNormalizers[widgetName] = res;
            }
            return res;
        },

        /**
         * Returns the normalized widget skin configuration.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @param {Object} widgetSkinObj object whose properties are all the skin classes for the widget. If it is not
         * null, and widgetName is correct, this method returns this object, after normalization.
         * @return {Object}
         */
        normalizeWidget : function (widgetName, widgetSkinObj) {
            if (!this.skinnableClasses.hasOwnProperty(widgetName)) {
                this.$logError(this.INVALID_SKINNABLE_CLASS, [widgetName]);
                return null;
            }
            if (widgetSkinObj == null) {
                widgetSkinObj = {};
            }
            var widgetNormalizer = this._getWidgetNormalizer(widgetName);
            var beanName = "aria.widgets.AriaSkinBeans." + widgetName + "Cfg";
            var std = widgetSkinObj.std;
            if (std == null) {
                this.$logWarn(this.MISSING_STD_SKINCLASS, [widgetName]);
                std = {};
                widgetSkinObj.std = std;
            }
            var result = true;
            var logs = aria.core.Log;
            var msgs = [];
            var checkRes;
            // Note that the order of this process is very important (std must be normalized at the end only)
            for (var skinClassName in widgetSkinObj) {
                if (widgetSkinObj.hasOwnProperty(skinClassName) && skinClassName != "std") {
                    var skinClass = widgetSkinObj[skinClassName];
                    widgetNormalizer.normSkinClass(skinClassName, skinClass, std);
                    checkRes = this._check(skinClass, beanName);
                    if (!checkRes.result) {
                        result = false;
                    }
                    if (logs && checkRes.message) {
                        msgs.push(logs.prepareLoggedMessage("In skin class %1:\n %2", [skinClassName,
                                checkRes.message.replace(/\n/g, "\n ")]));
                    }
                }
            }
            widgetNormalizer.normSkinClass("std", std, {});
            checkRes = this._check(std, beanName);
            if (!checkRes.result) {
                result = false;
            }
            if (logs && checkRes.message) {
                msgs.push(logs.prepareLoggedMessage("In skin class %1:\n %2", ["std",
                        checkRes.message.replace(/\n/g, "\n ")]));
            }
            if (!result) {
                this.$logWarn(this.WIDGET_NORMALIZATION_ERROR, [widgetName, msgs.join('\n').replace(/\n/g, "\n ")]);
            }
            widgetSkinObj['aria:skinNormalized'] = true;
            return widgetSkinObj;
        },

        /**
         * Processes an error object raised by the JsonValidator and returns an object with two properties: 'result' (a
         * boolean always equal to false) and 'message' (string containing the resulting error message, or null if no
         * error message is available).
         * @param {Object} e error object raised by the JsonValidator
         * @return {Object}
         */
        _processJsonValidatorError : function (e) {
            var message;
            var errors = e.errors;
            // PTR 05038013: aria.core.Log may not be available
            var logs = aria.core.Log;
            if (errors && errors.length > 0 && logs) {
                var msgs = [];
                var error;
                for (var index = 0, len = errors.length; index < len; index += 1) {
                    error = errors[index];
                    msgs[index] = logs.prepareLoggedMessage(error.msgId, error.msgArgs);
                }
                message = msgs.join('\n');
            }
            return {
                result : false,
                message : message
            };
        },

        /**
         * Calls aria.core.JsonValidator.check with the given parameters and returns an object with two properties:
         * 'result' (a boolean equal to true if the check was successful) and 'message' (string containing an error
         * message, or null if no error message is available).
         * @param {Object} object object to be checked
         * @param {String} beanName bean name which will be used to check the object
         * @return {Object}
         */
        _check : function (object, beanName) {
            try {
                return {
                    result : aria.core.JsonValidator.check(object, beanName, true),
                    message : null
                };
            } catch (e) {
                return this._processJsonValidatorError(e);
            }
        },

        /**
         * Calls aria.core.JsonValidator.normalize with the given parameter and returns an object with two properties:
         * 'result' (a boolean equal to true if the normalization was successful) and 'message' (string containing an
         * error message, or null if no error message is available).
         * @param {Object} param parameter for aria.core.JsonValidator.normalize
         * @return {Object}
         */
        _normalize : function (param) {
            try {
                return {
                    result : aria.core.JsonValidator.normalize(param, true),
                    message : null
                };
            } catch (e) {
                return this._processJsonValidatorError(e);
            }
        },

        /**
         * Normalizes the given general skin properties and returns it.
         * @param {aria.widgets.AriaSkinBeans.GeneralCfg} general
         */
        normalizeGeneral : function (general) {
            var param = {
                json : general,
                beanName : "aria.widgets.AriaSkinBeans.GeneralCfg"
            };
            var normalizationResults = this._normalize(param);
            if (!normalizationResults.result) {
                this.$logWarn(this.GENERAL_NORMALIZATION_ERROR, [normalizationResults.message.replace(/\n/g, "\n ")]);
            }
            general['aria:skinNormalized'] = true;
            return param.json;
        }

    }
});
