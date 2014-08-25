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
var ariaWidgetsErrorlistIErrorListController = require("./IErrorListController");
require("./CfgBeans");
var ariaTemplatesModuleCtrl = require("../../templates/ModuleCtrl");
var ariaUtilsArray = require("../../utils/Array");
var ariaUtilsJson = require("../../utils/Json");


/**
 * Error list
 * @class classname
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.widgets.errorlist.ErrorListController',
    $extends : ariaTemplatesModuleCtrl,
    $implements : [ariaWidgetsErrorlistIErrorListController],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._dataBeanName = "aria.widgets.errorlist.CfgBeans.Model";
    },
    $prototype : {
        $publicInterfaceName : 'aria.widgets.errorlist.IErrorListController',

        /**
         * Module initialization method
         * @param {aria.widgets.errorlist.CfgBeans:Model} initArgs init argument. Note that only the following
         * properties are taken into account: messages, title, divCfg, filterTypes and displayCodes.
         * @param {aria.core.CfgBeans:Callback} callback the callback description
         */
        init : function (args, cb) {
            this._data = {
                title : args.title,
                divCfg : args.divCfg,
                filterTypes : args.filterTypes,
                displayCodes : args.displayCodes
            };
            this.setMessages(args.messages);
            this.$callback(cb);
        },

        /**
         * Method to be called when changing the messages data structure.
         * @param {aria.utils.validators.CfgBeans:MessagesList} messages list of messages
         * @param {HTMLElement} element to which is to be made visible
         */
        setMessages : function (messages, element) {
            if (messages == null) {
                messages = [];
            }
            var map = {};
            var filteredMessages = this._processMessages(messages, map, this._data.filterTypes);
            this.json.setValue(this._data, "messageTypes", map);
            this.json.setValue(this._data, "messages", filteredMessages);
            var domRef = (filteredMessages.length > 0) ? element : null;
            this.$raiseEvent({
                name : "messagesChanged",
                domRef : domRef
            });
        },

        /**
         * Set the focus on the field which corresponds to the specified message.
         * @param {aria.utils.validators.CfgBeans:Message} message message linked to the field to focus
         */
        focusField : function (message) {
            if (!message.metaDataRef) {
                return;
            }
            if (message.metaDataRef.requireFocus) {
                // set the value to false before setting it to true
                this.json.setValue(message.metaDataRef, "requireFocus", false);
            }
            // this will notify the first widget bound to that field so that it gets the focus
            this.json.setValue(message.metaDataRef, "requireFocus", true);
        },

        /**
         * Recursive helper method to filter the messages according to the message types given as a parameter and
         * compute the resulting number of messages of each type.
         * @param {aria.utils.validators.CfgBeans:MessagesList} messagesList original list of messages to filter
         * @param {aria.widgets.errorlist.CfgBeans:Model.messageTypes} map object which will be filled to contain the
         * resulting number of messages for each type
         * @return {aria.widgets.errorlist.CfgBeans:Model.filterTypes} filterTypes types of the messages to filter
         * @protected
         */
        _processMessages : function (messagesList, map, filterTypes) {
            var res;
            for (var i = 0, l = messagesList.length; i < l; i++) {
                var msg = messagesList[i];
                var type = msg.type;
                var includeMsg = !filterTypes || ariaUtilsArray.contains(filterTypes, type);
                if (includeMsg) {
                    if (!map[msg.type]) {
                        map[msg.type] = 1;
                    } else {
                        map[msg.type] += 1;
                    }
                }
                var needNewRes = false;
                var subMessages = msg.subMessages;
                if (subMessages && subMessages.length > 0) {
                    subMessages = this._processMessages(subMessages, map, filterTypes);
                    if (subMessages.length > 0) {
                        // if the message has submessages which match the type filter,
                        // the message itself is kept to keep the structure, even if the type is not correct
                        includeMsg = true;
                    }
                    if (includeMsg && subMessages != msg.subMessages) {
                        // we are changing the array of sub-messages
                        // so we need a copy of both the message itself and the array of
                        // messages which contains it
                        needNewRes = true;
                        // 1 level copy of the message:
                        msg = ariaUtilsJson.copy(msg, false);
                        msg.subMessages = subMessages;
                    } else {
                        needNewRes = !includeMsg;
                    }
                } else {
                    needNewRes = !includeMsg;
                }
                if (!res && needNewRes) {
                    res = messagesList.slice(0, i);
                }
                if (res && includeMsg) {
                    res.push(msg);
                }
            }
            if (res == null) {
                res = messagesList;
            }
            return res;
        }
    }
});
