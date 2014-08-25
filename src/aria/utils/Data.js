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
var ariaUtilsType = require("./Type");
var ariaUtilsPath = require("./Path");
var ariaUtilsJson = require("./Json");
var ariaCoreJsObject = require("../core/JsObject");
var ariaUtilsArray = require("./Array");


/**
 * Handles the link between the validators and the data model.
 * @class aria.utils.Data
 * @extends aria.core.JsObject
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Data',
    $extends : ariaCoreJsObject,
    $singleton : true,
    $constructor : function () {
        this.utilsType = ariaUtilsType;
        this.utilsArray = ariaUtilsArray;
    },
    $statics : {
        NBROF_PREFIX : "nbrOf",
        META_PREFIX : Aria.FRAMEWORK_PREFIX + "meta::",

        // Message types
        TYPE_FATAL : "F",
        TYPE_ERROR : "E",
        TYPE_WARNING : "W",
        TYPE_INFO : "I",
        TYPE_NOTYPE : "N",
        TYPE_CRITICAL_WARNING : "C",
        TYPE_CONFIRMATION : "O",

        // ERROR MESSAGES:
        DATA_NO_PARAMETER_TO_CONTAINER : "Parameter %1 is not defined in container:",
        RESOLVE_FAIL : "Resolve for path %1 failed, root element does not contain this path",
        INVALID_VALIDATOR_GROUP_PARAMETER : "The validation group parameter must be an array.",
        DATA_UTIL_ERROR_MESSAGE_WRONG_TYPE : "listOfMessages property has to be an array."
    },
    $prototype : {
        /**
         * I set the containing validator object in the data model
         * @protected
         * @param {Object} dataHolder
         * @param {String} dataName
         * @param {Boolean} notifyChange, default to true. If set to false, won't use setValue
         * @return {Object}
         */
        _getMeta : function (dataHolder, dataName, notifyChange) {
            var metaDataName = this.META_PREFIX + dataName;
            var res = dataHolder[metaDataName];
            if (!res) {
                res = {};
                if (notifyChange === false) {
                    dataHolder[metaDataName] = res;
                } else {
                    ariaUtilsJson.setValue(dataHolder, metaDataName, res);
                }
            }
            return res;
        },

        /**
         * get a validator from the data model
         * @param {Object} dataHolder
         * @param {String} dataName
         * @return {Object}
         */
        getValidator : function (dataHolder, dataName) {
            var meta = this._getMeta(dataHolder, dataName);
            if (!meta) {
                return null;
            }
            return ariaUtilsJson.getValue(meta, "validator");
        },

        /**
         * get framework errors from the data model for a value object.
         * @param {Object} dataHolder Data object
         * @param {String} dataName Reference to a value in the data model
         * @return {Array} formatErrorMessages Data container for framework messages
         */
        getFrameworkMessage : function (dataHolder, dataName) {
            var meta = this._getMeta(dataHolder, dataName);
            if (this.utilsType.isArray(meta.formatErrorMessages)) {
                return meta.formatErrorMessages;
            }
            return null;
        },

        /**
         * Sets the group and event properties if there are some.
         * @param {Object} validator
         * @param {Array} groups [optional] contains the group(s) for the validator being set.
         * @param {String} event [optional] event that validation should occur on - either `onsubmit` or `onblur`. If
         * not specified, the default behavior is to validate `onsubmit`.
         */
        setValidatorProperties : function (validator, groups, event) {
            if (event) {
                validator.eventToValidate = event;
            }
            if (this.utilsType.isArray(groups) && groups.length) {
                for (var i = 0, item; item = groups[i]; i++) {
                    validator.groups.push(item);
                }
            } else if (this.utilsType.isString(groups) && groups != null) {
                this.$logError(this.INVALID_VALIDATOR_GROUP_PARAMETER);
            }
        },

        /**
         * set a validator into the data model. Set with validator equal to null to disable validation.
         * @param {Object} dataHolder object containing the data.
         * @param {String} dataName used to set the validator under.
         * @param {aria.utils.validators.Validator} validator to be set.
         * @param {Array} groups [optional] contains the group(s) for the validator being set.
         * @param {String} event [optional] event that validation should occur on - either `onsubmit` or `onblur`. If
         * not specified, the default behavior is to validate `onsubmit`.
         */
        setValidator : function (dataHolder, dataName, validator, groups, event) {

            var meta;
            this.setValidatorProperties(validator, groups, event);
            if ((this.utilsType.isObject(dataHolder) || this.utilsType.isArray(dataHolder)) && dataName in dataHolder) {
                meta = this._getMeta(dataHolder, dataName);
                ariaUtilsJson.setValue(meta, "validator", validator);
            } else {
                this.$logError(this.DATA_NO_PARAMETER_TO_CONTAINER, [dataName], dataHolder);
            }
        },

        /**
         * unset a validator in the data model. Calls setValidator with validator equal to null to disable validation.
         * @param {Object} dataHolder
         * @param {String} dataName
         */
        unsetValidator : function (dataHolder, dataName) {
            this.setValidator(dataHolder, dataName);
        },

        /**
         * Return a message object for given errorMessage type, localizedMessage and error code
         * @param {String} errorMessage
         * @param {String} localizedMessage If not specified, will be errorMessage
         * @param {String} type default is TYPE_ERROR
         * @param {String} code default is null
         * @param {Array} subMessages optional
         * @return {Object}
         */
        createMessage : function (errorMessage, localizedMessage, type, code, subMessages) {
            var defaultType = this.TYPE_ERROR;
            var message = {
                errorMessage : errorMessage,
                type : type || defaultType,
                localizedMessage : localizedMessage || errorMessage,
                code : code || null
            };
            if (subMessages) {
                message.subMessages = subMessages;
            }
            return message;
        },

        /**
         * Add a message in a message list
         * @param {Object} message the message to add
         * @param {Object} messagesList [optional] the list of messages to add to
         * @param {Object} inside [optional] part of the dataModel in which the message has to be added
         * @param {String} to [optional]
         */
        addMessage : function (message, messagesList, inside, to, addToList) {

            var jsonUtils = ariaUtilsJson;

            // internal variable to handle suberrors
            addToList = addToList !== false;

            // update message list if needed
            if (this.utilsType.isObject(messagesList)) {
                this._updateCounters(message, messagesList);
                if (!messagesList.listOfMessages) {
                    messagesList.listOfMessages = [];
                } else {
                    if (!this.utilsType.isArray(messagesList.listOfMessages)) {
                        this.$logError(this.DATA_UTIL_ERROR_MESSAGE_WRONG_TYPE);
                    }
                }
                if (addToList) {
                    messagesList.listOfMessages.push(message);
                }
                if (message.subMessages) {
                    for (var i = 0, subMessage; subMessage = message.subMessages[i]; i++) {
                        this.addMessage(subMessage, messagesList, null, null, false);
                    }
                }
            }

            // update datamodel if needed
            if (inside && to) {
                var meta = this._getMeta(inside, to);
                // If it is an error, store it in the errorMessages property
                // Do a copy so that listeners are notified when setting the new value:
                var errorMessages = jsonUtils.copy(meta.errorMessages);
                if (errorMessages == null) {
                    errorMessages = [message.localizedMessage];
                } else {
                    errorMessages.push(message.localizedMessage);
                }
                jsonUtils.setValue(meta, "errorMessages", errorMessages);
                jsonUtils.setValue(meta, "error", true);
            }
        },

        /**
         * Update messages counter in results
         * @protected
         * @param {Object} msg
         * @param {Object} results
         */
        _updateCounters : function (msg, results) {
            var counterProperty = this.NBROF_PREFIX + msg.type;
            if (results[counterProperty]) {
                results[counterProperty]++;
            } else {
                results[counterProperty] = 1;
            }
        },

        /**
         * ProcessMessages does two things: - in the messages structure, it adds a metadataRef property to each message. -
         * keeps a total of the different types of messages.
         * @protected
         * @param {Array} newMessagesArray
         * @param {Array} results
         */
        _processMessagesArray : function (newMessagesArray, results, errorMessages, metaDataRef) {
            var msg;
            for (var i = 0; i < newMessagesArray.length; i++) {
                msg = newMessagesArray[i];
                this._updateCounters(msg, results);
                msg.metaDataRef = metaDataRef;
                if (msg.type == this.TYPE_ERROR) {
                    errorMessages.push(msg.localizedMessage);
                }
                if (msg.subMessages) {
                    this._processMessagesArray(msg.subMessages, results, errorMessages, metaDataRef);
                }
            }
        },

        /**
         * Checks a validation group to see if a validator is a member.
         * @param {Array} validatorGroup containing the groups that a validator is a member of.
         * @param {Array} groups parameter that contains the group to check members of.
         * @return {Boolean}
         */
        checkGroup : function (validatorGroup, groups) {
            if (!groups) {
                return true;
            } else if (this.utilsType.isString(groups) && groups != null) {
                this.$logError(this.INVALID_VALIDATOR_GROUP_PARAMETER);
            } else if (this.utilsType.isArray(groups) && groups.length) {
                for (var i = 0, item; item = groups[i]; i++) {
                    if (this.utilsArray.contains(validatorGroup, item)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * Checks a validators eventToValidate property against the triggering event, will return true when there is a
         * match or if there is no triggering event (onsubmit).
         * @param {String} validatorEvent
         * @param {String} event
         * @return {Boolean}
         */
        checkEventToValidate : function (validatorEvent, event) {
            return (!event || validatorEvent === event);
        },

        /**
         * Call the validator associated to the data model field. Modify each message returned by the validator to
         * include (in the metadataRef property) the link to the meta-data structure dataHolder['meta::'+dataName] (1
         * level). Store the list of error messages in the data model, in the errorMessages property (previous content
         * of errorMessages is discarded). Add messages to the messages argument (if present). Return the list of
         * messages generated by the validator. Can return null or undefined if there are no errors.
         * @param {Object} dataHolder
         * @param {String} dataName
         * @param {Array} messages
         * @param {Array} groups [optional] contains the group(s) to be validated, if no group is specified then
         * validation will occur on the value as normal.
         * @param {String} event [optional] either `onsubmit` or `onblur`. If passed, only fires the validators that
         * were declared for that event. Useful mostly when dealing with MultipleValidator.
         * @return {Array}
         */
        validateValue : function (dataHolder, dataName, messages, groups, event) {
            var validator = this.getValidator(dataHolder, dataName), utilsJson = ariaUtilsJson;
            var frameworkMessage = this.getFrameworkMessage(dataHolder, dataName);
            var hasFrameworkMessage = frameworkMessage && frameworkMessage.length;
            var meta = this._getMeta(dataHolder, dataName);

            // check if there is a validator of the right group with the right event
            var properValidator = false;
            if (validator && validator.groups) {
                properValidator = this.checkGroup(validator.groups, groups);
                properValidator = properValidator && this.checkEventToValidate(validator.eventToValidate, event);
            }

            var validateRes;
            if (hasFrameworkMessage) {
                validateRes = [this.createMessage(frameworkMessage[0])];
            } else if (properValidator) {
                // groups and event passed in for MultipleValidators.validate method
                validateRes = validator.validate(dataHolder[dataName], groups, event);
            }

            if (validateRes) {

                // create a fake message if none were specified
                if (!messages) {
                    messages = {};
                }

                // update messages given as argument
                var errorMessages = [];
                this._processMessagesArray(validateRes, messages, errorMessages, meta);
                if (messages.listOfMessages) {
                    messages.listOfMessages = messages.listOfMessages.concat(validateRes);
                } else {
                    messages.listOfMessages = validateRes;
                }

                // only set messages in the datamodel if it's not coming from the view
                if (!hasFrameworkMessage) {
                    utilsJson.setValue(meta, "errorMessages", errorMessages);
                    utilsJson.setValue(meta, "error", errorMessages.length > 0);
                }
            } else {
                utilsJson.setValue(meta, "errorMessages", []);
                utilsJson.setValue(meta, "error", false);
            }
            return validateRes;
        },

        /**
         * validates an object within the data model, including all fields values and validation stacks for those fields
         * @param {Object} dataHolder
         * @param {Object} messages
         * @param {Array} groups an optional parameter that contains the group(s) to be validated, if no group is
         * specified then validation will occur on the model as normal.
         */
        validateModel : function (dataHolder, messages, groups) {
            if (this.utilsType.isObject(dataHolder)) {
                for (var key in dataHolder) {
                    if (dataHolder.hasOwnProperty(key)) {
                        this.__subValidateModel(dataHolder, key, messages, groups);
                    }
                }
            } else if (this.utilsType.isArray(dataHolder)) {
                for (var index = 0, l = dataHolder.length; index < l; index++) {
                    this.__subValidateModel(dataHolder, index, messages, groups);
                }
            }
        },

        /**
         * validates a parameter of an object within the data model
         * @private
         * @param {Object} dataHolder
         * @param {String} parameter
         * @param {Object} messages
         * @param {Array} group an optional parameter that contains the group(s) to be validated.
         */
        __subValidateModel : function (dataHolder, parameter, messages, groups) {
            // filters meta marker and aria metadata
            if (!ariaUtilsJson.isMetadata(parameter)) {
                if (dataHolder[this.META_PREFIX + parameter]) {
                    this.validateValue(dataHolder, parameter, messages, groups);
                }
                var value = dataHolder[parameter];
                this.validateModel(value, messages, groups);
            }
        },

        /**
         * Processes an array of messages received from the server and do the appropriate changes to that structure and
         * to the data model so that widgets display error messages and the error list widget can provide a link to the
         * widgets.
         * @param {Array} newMessages array of messages (can be null)
         * @param {Object} rootData data model root (all fieldRef are relative to that object)
         * @param {Object} messages object storing the listOfMessages property and a set of nbrOfXXX properties
         * containing the number of messages of each type. This object will be updated with the new messages
         * @param {Boolean} addToListOfMessages by default, true
         * @return {Object}
         */
        processMessages : function (newMessages, rootData, messages, addToListOfMessages) {

            var pathUtils = ariaUtilsPath, jsonUtils = ariaUtilsJson, pathParts, lastPath, container;

            if (messages == null) {
                messages = {};
            }
            if (newMessages == null) {
                // no new message: nothing to do
                return messages;
            }
            for (var i = 0, l = newMessages.length; i < l; i++) {
                var msg = newMessages[i];
                // update nbrOfSOMETHING in messages, even for sub messages
                this._updateCounters(msg, messages);
                if (msg.type == this.TYPE_ERROR) {
                    if (msg.fieldRef && !msg.metaDataRef) {
                        // fieldRef is a path in rootData.
                        // param1.param2 will match rootData.param1.param2
                        try {
                            pathParts = pathUtils.parse(msg.fieldRef);
                            lastPath = pathParts.pop();
                            // resolve path of container and get the meta data for the appropriate param name
                            container = pathUtils.resolve(pathParts, rootData);
                            if (this.utilsType.isContainer(container)) {
                                msg.metaDataRef = this._getMeta(container, lastPath);
                            } else {
                                // resolve can return something not being a container -> raise an error as well
                                throw null;
                            }
                        } catch (e) {
                            this.$logError(this.RESOLVE_FAIL, [msg.fieldRef], rootData);
                        }
                    }
                    if (msg.metaDataRef) {
                        // If it is an error, store it in the errorMessages property
                        // Do a copy so that listeners are notified when setting the new value:
                        var errorMessages = jsonUtils.copy(msg.metaDataRef.errorMessages);
                        if (errorMessages == null) {
                            errorMessages = [msg.localizedMessage];
                        } else {
                            errorMessages.push(msg.localizedMessage);
                        }
                        jsonUtils.setValue(msg.metaDataRef, "errorMessages", errorMessages);
                        jsonUtils.setValue(msg.metaDataRef, "error", true);
                    }
                }
                if (msg.subMessages) {
                    this.processMessages(msg.subMessages, rootData, messages, false);
                }
            }
            if (addToListOfMessages !== false) {
                var listOfMessages = messages.listOfMessages;
                if (listOfMessages && listOfMessages.length > 0) {
                    messages.listOfMessages = listOfMessages.concat(newMessages);
                } else {
                    messages.listOfMessages = newMessages;
                }
            }
            return messages;
        }
    }
});
