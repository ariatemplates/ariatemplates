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
 * Interface for the error list controller.
 * @class aria.widgets.errorlist.IErrorListController
 */
Aria.interfaceDefinition({
    $classpath : 'aria.widgets.errorlist.IErrorListController',
    $extends : 'aria.templates.IModuleCtrl',
    $events : {
        "messagesChanged" : "Raised when the list of messages to be displayed has changed."
    },
    $interface : {
        /**
         * Method to be called when changing the messages data structure.
         * @param {Array} messages
         */
        setMessages : function (messages) {},
        /**
         * Set the focus on the field which corresponds to the specified message.
         * @param {Object} message aria.utils.validators:CfgBeans.Message
         */
        focusField : function (message) {}
    }
});
