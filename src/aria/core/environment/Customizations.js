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
var Aria = require("../../Aria");
require("./CustomizationsCfgBeans");
var ariaCoreEnvironmentEnvironmentBase = require("./EnvironmentBase");
var ariaUtilsType = require("../../utils/Type");
var ariaUtilsJson = require("../../utils/Json");
var ariaCoreIO = require("../IO");
var ariaCoreJsonValidator = require("../JsonValidator");


/**
 * Contains getters for the Number environment.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.environment.Customizations",
    $extends : ariaCoreEnvironmentEnvironmentBase,
    $singleton : true,
    $statics : {
        DESCRIPTOR_NOT_LOADED : "A customization descriptor was specified but could not be loaded (url: '%1')",
        INVALID_DESCRIPTOR : "The Customization descriptor at '%1' is invalid"
    },
    $events : {
        "descriptorLoaded" : {
            description : "Notifies that the customization descriptor has been loaded"
        }
    },
    $constructor : function () {
        /**
         * True if a customization has been configured (see setEnvironment() )
         * @protected
         * @type Boolean
         */
        this._isCustomized = false;
        /**
         * if _isCustomized && the descriptor has been succesfully loaded
         * @protected
         * @type Boolean
         */
        this._descriptorLoaded = false;
        /**
         * Path to the customization descriptor.
         * @protected
         * @type String
         */
        this._customizationDescriptor = null;
        /**
         * Stores app-wide cutomization settings
         * @protected
         * @type Object
         */
        this._customizations = {
            templates : {},
            modules : {}
        };
        this.$EnvironmentBase.constructor.call(this);
    },
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.core.environment.CustomizationsCfgBeans.AppCfg",

        /**
         * Apply the current environment.
         * @param {aria.core.CfgBeans:Callback} callback Will be called after the environment variables are applied
         * @protected
         */
        _applyEnvironment : function (callback) {
            var customization = this.checkApplicationSettings("customization");
            // if the descriptor path has changed or a json object has been passed reload it
            if (customization
                    && (customization.descriptor !== this._customizationDescriptor || ariaUtilsType.isObject(customization.descriptor))) {
                // the path to the customization descriptor has changed, reload it
                this._customizationDescriptor = customization.descriptor;
                this.reloadCustomizationDescriptor();
            }
            this.$callback(callback);
        },

        /**
         * Internal callback called by the IO object when the customization descriptor has been succesfully received
         * @protected
         * @param {Object} ioRes IO result object
         */
        _onDescriptorReceive : function (ioRes) {
            var downloadFailed = (ioRes.status != '200');
            if (downloadFailed) {
                this.$logError(this.DESCRIPTOR_NOT_LOADED, this._customizationDescriptor);
            } else {
                var resJson = ariaUtilsJson.load(ioRes.responseText);
                if (resJson == null) {
                    // the descriptor was not valid json
                    this.$logError(this.INVALID_DESCRIPTOR, this._customizationDescriptor);
                    this.$raiseEvent("descriptorLoaded");
                    return;
                }

                this._setCustomizationDescriptor(resJson);
            }

            this._descriptorLoaded = true;
            this.$raiseEvent("descriptorLoaded");
        },

        /**
         * Internal method to set the customization descriptor after it has been loaded (or passed as a json object)
         * @protected
         * @param {aria.core.environment.CustomizationsCfgBeans:DescriptorCfg} descrObj Json object containg descriptor
         */
        _setCustomizationDescriptor : function (descrObj) {
            var validJson = ariaCoreJsonValidator.normalize({
                json : descrObj,
                beanName : "aria.core.environment.CustomizationsCfgBeans.DescriptorCfg"
            });

            if (!validJson) {
                this.$logError(this.INVALID_DESCRIPTOR, this._customizationDescriptor);
            } else {
                // reset customizations
                this._customizations = descrObj;
            }
        },

        /**
         * Reload the customization descriptor from the URL passed in the environment
         * @public
         */
        reloadCustomizationDescriptor : function () {
            this._isCustomized = (this._customizationDescriptor ? true : false);
            if (this._isCustomized) {
                this._descriptorLoaded = false;

                if (ariaUtilsType.isString(this._customizationDescriptor)) {
                    ariaCoreIO.asyncRequest({
                        url : this._customizationDescriptor,
                        callback : {
                            fn : this._onDescriptorReceive,
                            onerror : this._onDescriptorReceive,
                            scope : this
                        }
                    });
                } else {
                    this._setCustomizationDescriptor(this._customizationDescriptor);
                    this._descriptorLoaded = true;
                    this.$raiseEvent("descriptorLoaded");
                }
            }
        },

        /**
         * Returns True if a customization descriptor has been set in the environment
         * @public
         * @return {Boolean}
         */
        isCustomized : function () {
            return this._isCustomized;
        },

        /**
         * Returns True if isCustomized() && the customization descriptor has been loaded
         * @public
         * @return {Boolean}
         */
        descriptorLoaded : function () {
            return this._descriptorLoaded;
        },

        /**
         * Returns the classpath of the custom flow which is to replace an original template, or the original template's
         * CP if no customization for the template was specified
         * @public
         * @param {String} originalCP The original ClassPath
         */
        getFlowCP : function (originalCP) {
            var newCP = originalCP;
            if (this._isCustomized) {
                if (this._customizations.flows[originalCP] != null) {
                    newCP = this._customizations.flows[originalCP];
                }
            }
            return newCP;
        },

        /**
         * Returns an array with the description of custom modules to be attached to the given module.\
         * @public
         * @param {String} parentModuleCP classpath of the parent module
         * @return {Array} array of custom sub-module descriptions (array of
         * aria.core.environment.CustomizationsCfgBeans.CustomModuleCfg)
         */
        getCustomModules : function (parentModuleCP) {
            if (this._isCustomized) {
                var res = this._customizations.modules[parentModuleCP];
                if (res) {
                    return res;
                }
            }
            return [];
        },

        /**
         * Returns the customizations currently defined.
         * @public
         * @return {aria.core.environment.CustomizationsCfgBeans:DescriptorCfg}
         */
        getCustomizations : function () {
            return ariaUtilsJson.copy(this._customizations);
        },

        /**
         * Returns the classpath of the custom template which is to replace an original template, or the original
         * template's CP if no customization for the template was specified
         * @public
         * @param {String} originalCP The original ClassPath
         * @return {String} customized cp
         */
        getTemplateCP : function (originalCP) {
            var newCP = originalCP;
            if (this._isCustomized) {
                if (this._customizations.templates[originalCP] != null) {
                    newCP = this._customizations.templates[originalCP];
                }
            }
            return newCP;
        },

        /**
         * Set a new customization descriptor, replacing completely the old one.
         * @public
         * @param {String|aria.core.environment.CustomizationsCfgBeans:DescriptorCfg} customizations either a string
         * containing the URL of the customization descriptor, or a json object with the content of the descriptor.
         */
        setCustomizations : function (customizations) {
            // change in the config:
            var cfgCustomization = this.checkApplicationSettings("customization");
            cfgCustomization.descriptor = customizations;
            this._customizationDescriptor = customizations;
            this.reloadCustomizationDescriptor();
        }
    }
});
