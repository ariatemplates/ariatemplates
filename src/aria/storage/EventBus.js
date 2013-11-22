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
 * Singleton used as an event bus between multiple instances of Storage classes. This class raises events trigger by
 * instances on the same page or on different pages accessing the same storage location (like in a different browser's
 * tab)
 */
Aria.classDefinition({
    $classpath : "aria.storage.EventBus",
    $singleton : true,
    $events : {
        "change" : "Raised when a change happens in any of the linked instances"
    },
    $prototype : {
        /**
         * Since some browsers (FF 3.6) raise a native event when the change happens on the same window, this flag tells
         * whether the brwoser event should be stopped or not. It is on this singleton as it's shared across instances
         * @type Boolean
         */
        stop : false,

        /**
         * Notify that a change event happened on a specific storage location
         * @param {String} location Storage location where the event is happening, i.e. local/session
         * @param {String} key Id of the value that is changing, null if clear
         * @param {String} value Value being set, null if removed
         * @param {String} old Old value being changed, null if newly added
         * @param {String} nspace Namspace of the storage instance
         */
        notifyChange : function (location, key, value, old, nspace) {
            this.$raiseEvent({
                name : "change",
                location : location,
                namespace : nspace,
                key : key,
                newValue : value,
                oldValue : old,
                url : Aria.$window.location
            });
        }
    }
});
