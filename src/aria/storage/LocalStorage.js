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

(function () {
    /**
     * Modify a class instance to use methods from an instance of aria.storage.UserData used as fallback. This should
     * happen in IE7 since it doesn't support localStorage but UserData that provides the same functionalities
     */
    function fallback (self, instance) {
        self._get = instance._get;
        self._set = instance._set;
        self._remove = instance._remove;
        self._clear = instance._clear;

        self.storage = aria.storage.UserData._STORAGE;
        self.__keys = aria.storage.UserData._ALL_KEYS;
    }

    /**
     * Storage class using HTML5 local storage as data storage/retrieval mechanism.<br />
     * Creating an instance of this class in a browser that doesn't support local storage will raise an error. In
     * Internet Explorer 7, which doesn't have local storage, userData is used instead because it provides the same
     * functionality of storage across sessions. Web Storage API limit the acceptable values to strings.<br />
     * For json objects a serializer could be passed to the class constructor in order to have serialization and
     * de-serialization of objects.<br />
     * An optional namespace string can be given to avoid collisions between different instances of session storage.<br />
     * Being stored in local storage, the information is available even after the user closes and reopens the browser's
     * window.
     */
    Aria.classDefinition({
        $classpath : "aria.storage.LocalStorage",
        $extends : "aria.storage.HTML5Storage",
        $dependencies : ["aria.core.Browser", "aria.storage.UserData"],
        /**
         * Create an instance of LocalStorage. Try ot use userData if missing
         * @param {aria.storage.Beans:ConstructorArgs} options Constructor options
         */
        $constructor : function (options) {
            var isIE7 = aria.core.Browser.isIE7;

            // Throw an error only in IE7
            this.$HTML5Storage.constructor.call(this, options, "localStorage", !isIE7);

            if (!this.storage && isIE7) {
                var instance = new aria.storage.UserData(options);
                fallback(this, instance);

                /**
                 * Whether or not this instance is using a fallback mechanism for localStorage
                 * @type aria.storage.UserData
                 * @protected
                 */
                this._fallback = instance;
            }
        },
        $destructor : function () {
            if (this._fallback) {
                this._fallback.$dispose();
                this._fallback = null;
            }

            this.$HTML5Storage.$destructor.call(this);
        }
    });
})();