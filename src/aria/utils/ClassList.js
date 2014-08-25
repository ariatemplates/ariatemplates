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


/**
 * Wrapper to manage classes for DOM elements inside templates.
 * @class aria.utils.ClassList
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.ClassList',
    /**
     * Create a DOM Wrapper object to allow safe changes in the DOM classes without giving direct access to the DOM.
     * Note that a closure is used to prevent access to the domElt object from the template.
     * @param {HTMLElement} domElt DOM element which is wrapped
     */
    $constructor : function (domElt) {
        this.setClassName = function (className) {
            domElt.className = className;
        };

        this.getClassName = function () {
            return domElt.className;
        };

        this._dispose = function () {
            domElt = null;
            this._dispose = null;
        };
    },
    $destructor : function () {
        if (this._dispose) {
            this._dispose();
        }
    },
    $prototype : {
        // Empty functions are defined in the prototype to have JsDoc correctly generated.

        /**
         * Add the class name to the class attribute. Does nothing if the classname already exists.
         * @param {String|Array} className The class name or an array of class names to be added
         */
        add : function (className) {
            this._replace(false, className);
        },
        /**
         * Remove the class name to the class attribute. Does nothing if the classname doesn't exist.
         * @param {String|Array} className The class name or an array of class names to be removed
         */
        remove : function (className) {
            this._replace(className, false);
        },
        /**
         * Add the classname to the class attribute if it doesn't exist, otherwise remove it.
         * @param {String} className The class name to toggle
         */
        toggle : function (className) {
            if (this.contains(className)) {
                this.remove(className);
            } else {
                this.add(className);
            }
        },
        /**
         * Returns true if the class name is in the class attribute
         * @param {String} className The class name to test
         * @return {Boolean}
         */
        contains : function (className) {
            var classes = this.getClassName().split(" ");
            for (var i = 0, ii = classes.length; i < ii; i++) {
                if (classes[i] == className) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Replaces a class with another class. If no oldClassName is present, the newClassName is simply added.
         * @param {String|Array} oldClassName The class name or an array of class names to be replaced
         * @param {String|Array} newClassName The class name or an array of class names that will be replacing the old
         * class name
         */
        _replace : function (oldClassName, newClassName) {
            var rem = [], add = [];

            if (!!oldClassName) {
                rem = (typeof oldClassName == "string") ? oldClassName.split(" ") : oldClassName;
            }

            if (!!newClassName) {
                add = (typeof newClassName == "string") ? newClassName.split(" ") : newClassName;
            }

            var classString = this.getClassName(), found = false;
            var classes = !!classString ? classString.split(" ") : [];

            // Remove oldClassNames
            for (var j = classes.length - 1; j >= 0; j -= 1) {
                if (!classes[j]) {
                    classes.splice(j, 1);
                    continue;
                }

                // Remove duplicates
                for (var d = add.length - 1; d >= 0; d -= 1) {
                    if (classes[j] == add[d]) {
                        // Remove it from classes as I'm going to add it again
                        classes.splice(j, 1);
                    }
                }

                for (var k = rem.length - 1; k >= 0; k -= 1) {
                    if (classes[j] == rem[k]) {
                        classes.splice(j, 1);
                        found = true; // Iterate for multiple classes
                    }
                }
            }

            if (!found && add.length === 0) {
                return;
            }

            classes.push.apply(classes, add);
            this.setClassName(classes.join(" "));
        },
        /**
         * Set the class attribute
         * @param {String} className The classname property to set. This string will replace the existing class
         * attribute.
         */
        setClassName : function (className) {},
        /**
         * Get the class attribute
         * @return {String} returns the classname property
         */
        getClassName : function () {}
    }
});
