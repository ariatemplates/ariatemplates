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
 * TODO: when the framework will implement a History utility, this class has to be moved in the right place, probably in
 * a different package because the hash management will be only one of the possibilities for handling browser history.
 * It could be used as a fallback for those browsers which are not compliant with HTML5 specifications for history
 * management
 * @class aria.utils.HashManager Utils for location hash management
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : 'aria.utils.HashManager',
    $singleton : true,
    $dependencies : ["aria.core.Browser", "aria.utils.Type", "aria.utils.Event", "aria.utils.Object",
            "aria.utils.AriaWindow"],
    $statics : {
        INVALID_SETHASH_ARGUMENT : "Invalid argument passed to aria.utils.HashManager.setHash method.",
        INVALID_SETSEPARATORS_ARGUMENTS : "Invalid argument passed to aria.utils.HashManager.setSeparators method.",
        INVALID_SEPARATOR : "Expression %1 cannot be used as separator.",
        INVALID_HASHPOLLING_TRIGGER : "Enabling hash polling is allowed only in IE7.",
        INVALID_HASHOBJECT_TYPE : "Invalid hash object: value corresponding to key %1 is not a string.",
        INVALID_HASHOBJECT_VALUE : "Invalid hash object: value '%1' corresponding to key '%2' of the hashObject contains one the non encodable separators '%3'",
        INVALID_HASHOBJECT_KEY : "Invalid hash object: key '%1' of the hashObject contains one the non encodable separators '%2'"
    },
    $constructor : function () {

        /**
         * List of separators between two key=value pairs
         * @type {Array}
         * @protected
         */
        this._separators = [",", "&"];

        /**
         * Separators regular expression
         * @type {RegExp}
         * @protected
         */
        this._separatorRegExp = this.__buildRegExpFromArray(this._separators);

        /**
         * List of separators that cannot be encoded and hence cannot be used in the values
         * @type {Array}
         * @protected
         */
        this._nonEncodableSeparators = this.__getNonEncodedSeparators(this._separators);

        /**
         * Non encodable separators regular expression
         * @type {RegExp}
         * @protected
         */
        this._nonEncodableSepRegExp = this.__buildRegExpFromArray(this._nonEncodableSeparators);

        /**
         * List of callbacks for the hashchange event
         * @type {Array}
         * @protected
         */
        this._hashChangeCallbacks = null;

        /**
         * Current hash string
         * @type {String}
         * @protected
         */
        this._currentHashString = decodeURIComponent(this.getHashString());

        /**
         * Enable the IE7 polling for hashChange
         * @type {Boolean}
         * @protected
         */
        this._enableIE7polling = aria.core.Browser.isIE7;

        /**
         * Shortcut to aria.utils.Type
         * @type {aria.utils.Type}
         * @protected
         */
        this._typeUtil = aria.utils.Type;

        /**
         * Poll interval for ie7
         * @type {Number}
         */
        this.ie7PollDelay = 75;

    },
    $destructor : function () {
        /**
         * Remove the default callback for hashchange
         */
        this._removeHashChangeInternalCallback();
    },

    $prototype : {

        /**
         * Return the current hash Object. Examples:
         * <ul>
         * Examples: suppose that "," is a separator. Then
         * <li> if hash = "#first=myFirst,second=mySecond" it returns {first : "myFirst", second : "mySecond"}</li>
         * <li> if hash = "#myFirst" it returns {param0 : "myFirst"}</li>
         * </ul>
         * @return {Object} current hash object
         */
        getHashObject : function () {
            return aria.utils.Json.copy(this._extractHashObject(this.getHashString()));
        },
        /**
         * Return the current hash string excluding the '#' character at the beginning
         * @return {String} current hash object
         */
        getHashString : function () {
            var href = Aria.$window.location.href;
            var sharpIndex = href.indexOf("#");
            if (sharpIndex != -1) {
                return href.substring(sharpIndex + 1);
            }
            return "";
        },

        /**
         * Sets the hash starting from a string or an object. The string can contain the starting "#" or not.
         * @param {String|Object} hashString
         */
        setHash : function (arg) {
            var newHashString = "";
            if (this._typeUtil.isObject(arg)) {
                if (this._validateHashObject(arg)) {
                    newHashString = this._stringifyHashObject(arg);
                } else {
                    return;
                }
            } else if (this._typeUtil.isString(arg)) {
                newHashString = (!arg) ? "" : arg;
            } else {
                this.$logError(this.INVALID_SETHASH_ARGUMENT);
            }
            if (this.getHashString() != newHashString) {
                Aria.$window.location.hash = newHashString;
            }
        },

        /**
         * Add a callback to hashchange event. The callback will receive the hash object as first parameter
         * @param {aria.core.JsObject.Callback} cb
         */
        addCallback : function (cb) {
            if (this._hashChangeCallbacks == null) {
                this._hashChangeCallbacks = [];
                aria.utils.AriaWindow.attachWindow();
                this._addHashChangeInternalCallback();
            }
            this._hashChangeCallbacks.push(cb);
        },

        /**
         * Remove a callback to hashchange event
         * @param {aria.core.JsObject.Callback} cb
         */
        removeCallback : function (cb) {
            var hcC = this._hashChangeCallbacks;
            if (hcC != null) {
                var len = hcC.length, i = 0;
                while (i < len && hcC[i] != cb) {
                    i++;
                }
                if (i < len) {
                    hcC.splice(i, 1);
                    if (hcC.length == 0) {
                        this._hashChangeCallbacks = null;
                        this._removeHashChangeInternalCallback();
                        aria.utils.AriaWindow.detachWindow();
                    }
                }
            }
        },

        /**
         * Set the separator for the hash string and immediately updates it accordingly. Invalid characters for
         * separators are the following : "#", "%", "^", "[", "]", "{", "}", "\\", "\"", "<", ">", "="
         * @param {String|Array} args either a single character or an array of single characters
         */
        setSeparators : function (args) {
            var separators, hashObject = this.getHashObject();
            // characters that cannot be used in a hash and the equal sign that we use in order to separate keys from
            // values
            var invalidCharactersRegexp = this.__buildRegExpFromArray(["#", "%", "^", "[", "]", "{", "}", "\\", "\"",
                    "<", ">", "="]);
            if (this._typeUtil.isString(args)) {
                separators = [args];
            } else if (this._typeUtil.isArray(args)) {
                separators = args;
            } else {
                return;
            }
            for (var i = 0, len = separators.length; i < len; i++) {
                if (separators[i].match(invalidCharactersRegexp)) {
                    this.$logError(this.INVALID_SEPARATOR, separators[i]);
                    return;
                }
            }

            this._separators = separators;
            this._separatorRegExp = this.__buildRegExpFromArray(this._separators);
            this._nonEncodableSeparators = this.__getNonEncodedSeparators(this._separators);
            this._nonEncodableSepRegExp = this.__buildRegExpFromArray(this._nonEncodableSeparators);
            if (!aria.utils.Object.isEmpty(hashObject)) {
                this.setHash(hashObject);
            }
        },

        /**
         * Adds the separators for the hash string and immediately updates it accordingly. Invalid characters for
         * separators are the following : "#", "%", "^", "[", "]", "{", "}", "\\", "\"", "<", ">", "="
         * @param {String|Array} args either a single character or an array of single characters
         */
        addSeparators : function (args) {
            var addedSeparators, newSeparators = this._separators;
            if (this._typeUtil.isString(args)) {
                addedSeparators = [args];
            } else if (this._typeUtil.isArray(args)) {
                addedSeparators = args;
            } else {
                return;
            }
            for (var i = 0, len = addedSeparators.length; i < len; i++) {
                if (!(aria.utils.Array.contains(this._separators, addedSeparators[i]))) {
                    newSeparators.push(addedSeparators[i]);
                }
            }
            this.setSeparators(newSeparators);
        },

        /**
         * Enable/disable the IE7 hash polling. The hash polling is automatically enabled when on IE7. It is still
         * possible to disable it. It is not possible to enable it if you are not on IE7.
         * @param {Boolean} enable whether the hash polling should be enabled or not
         */
        setIE7polling : function (enable) {
            if (enable && !aria.core.Browser.isIE7) {
                this.$logWarn(this.INVALID_HASHPOLLING_TRIGGER);
            }
            enable = enable && aria.core.Browser.isIE7;
            if (enable && !this._enableIE7polling) {
                this._enableIE7polling = enable;
                this._hashPoll();
            } else {
                this._enableIE7polling = enable;
            }
        },

        /**
         * Turn a hash object into a string by using as separator the first one provided. There is no check on the
         * object.
         * @param {Object} hashObject
         * @return {String}
         */
        _stringifyHashObject : function (hashObject) {
            var hashStringArray = [];
            for (var key in hashObject) {
                if (hashObject.hasOwnProperty(key)) {
                    hashStringArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(hashObject[key]));
                }
            }
            return hashStringArray.join(this._separators[0]);
        },

        /**
         * Extract the hash object from the hash string
         * @protected
         * @param {String} hashString
         * @return {Object} hashObject
         */
        _extractHashObject : function (hashString) {
            var pairs = hashString, hashObject = {}, currentPair, currentPairString;
            pairs = (pairs) ? pairs.split(this._separatorRegExp) : [];
            for (var i = 0, size = pairs.length; size > i; i++) {
                currentPairString = pairs[i];
                currentPair = decodeURIComponent(currentPairString).split("=");
                if (currentPair.length == 2) {
                    hashObject[currentPair[0]] = currentPair[1];
                } else {
                    if (currentPairString.indexOf("=") == currentPairString.length) {
                        hashObject[currentPair[0]] = "";
                    } else {
                        hashObject["param" + i] = currentPair[0];
                    }
                }
            }
            return hashObject;
        },

        /**
         * Add the default hashchange callback
         * @protected
         */
        _addHashChangeInternalCallback : function () {
            this._hashPoll();
            if (!aria.core.Browser.isIE7) {
                aria.utils.Event.addListener(Aria.$window, 'hashchange', {
                    fn : this._internalCallback,
                    scope : this
                }, true);
            }

        },
        /**
         * Nedeed because IE7 does not fire the 'hashchange' event. Verify if the hash has changed. If so, it triggers
         * the internal hashchange callback
         * @protected
         */
        _hashPoll : function () {
            if (this._enableIE7polling) {
                aria.core.Timer.addCallback({
                    fn : this._hashPoll,
                    scope : this,
                    delay : this.ie7PollDelay
                });
                var hash = this.getHashString();
                if (hash != this._currentHashString) {
                    this._internalCallback();
                }
            }
        },

        /**
         * Updates the internal hash information and calls the added callbacks
         * @protected
         */
        _internalCallback : function () {
            var callbacks = this._hashChangeCallbacks, cb;
            if (callbacks == null) {
                return;
            }
            this._currentHashString = this.getHashString();
            var currentHashObject = this._extractHashObject(this._currentHashString);
            for (var i = 0, size = callbacks.length; size > i; i++) {
                cb = callbacks[i];
                cb = this.$normCallback(cb);
                this.$callback(cb, currentHashObject);
            }
        },

        /**
         * Remove the default hashchange callback
         * @protected
         */
        _removeHashChangeInternalCallback : function () {
            if (!aria.core.Browser.isIE7) {
                aria.utils.Event.removeListener(Aria.$window, 'hashchange', {
                    fn : this._internalCallback
                });
            }
        },

        /**
         * Checks that the values contained in the hashObject are strings and that both the keys and the values do not
         * contain any of the characters specified as separators that cannot be encoded
         * @param {Object} hashObject
         * @return {Boolean} true if the hashObject is valid, false otherwise
         * @protected
         */
        _validateHashObject : function (hashObject) {
            var prop, re = this._nonEncodableSepRegExp;
            for (var key in hashObject) {
                if (hashObject.hasOwnProperty(key)) {
                    if (re && key.match(re)) {
                        this.$logError(this.INVALID_HASHOBJECT_KEY, [key, this._nonEncodableSeparators.join("")]);
                        return false;
                    } else {
                        prop = hashObject[key];
                        if (this._typeUtil.isString(prop)) {
                            if (re && prop.match(re)) {
                                this.$logError(this.INVALID_HASHOBJECT_VALUE, [prop, key,
                                        this._nonEncodableSeparators.join("")]);
                                return false;
                            }
                        } else {
                            this.$logError(this.INVALID_HASHOBJECT_TYPE, key);
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        /**
         * Return the array of separators that cannot be encoded
         * @param {Array} sep Array of separators
         * @return {Array} array of non encodable separators
         */
        __getNonEncodedSeparators : function (sep) {
            var nonEncodedSep = [];
            for (var i = 0, len = sep.length; i < len; i++) {
                if (sep[i] == encodeURIComponent(sep[i])) {
                    nonEncodedSep.push(sep[i]);
                }
            }
            return nonEncodedSep;
        },

        /**
         * Return the regular expression needed to match one occurrence of any of the strings specified in the entries
         * of the array
         * @param {Array} arg Array of alternatives
         * @return {RegExp}
         */
        __buildRegExpFromArray : function (arg) {
            var specialCharRegExp = /([\^\$\.\*\+\?\=\!\:\|\\\/\(\)\[\]\{\}]){1,1}/g;
            var regexpStringArray = [];
            for (var i = 0, len = arg.length; i < len; i++) {
                regexpStringArray.push(arg[i].replace(specialCharRegExp, "\\$1"));
            }
            if (regexpStringArray.length == 0) {
                return null;
            } else {
                return new RegExp(regexpStringArray.join("|"));
            }
        }

    }
});