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

Aria.classDefinition({
    $classpath : "test.aria.core.BrowserTest",
    $dependencies : ["aria.core.Browser", "aria.utils.Array"],
    $extends : "aria.jsunit.TestCase",

    $constructor : function () {
        this.$TestCase.constructor.call(this);

        this.originalWindow = Aria.$window;
    },

    $destructor : function () {
        this.originalWindow = null;

        this.$TestCase.$destructor.call(this);
    },

    $prototype : {
        tearDown : function () {
            this.reset();
        },

        /**
         * Resets everything altered for testing purposes.
         */
        reset : function () {
            aria.core.Browser.init();

            Aria.$window = this.originalWindow;
        },

        /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1397) */
        testToString : function () {
            var browserToString = aria.core.Browser.toString();

            this.assertTrue(
                browserToString != "[object Object]",
                "aria.core.Browser.toString method not overridden correctly. " +
                "Expected something different from [object Object]"
            );
        },
        /* BACKWARD-COMPATIBILITY-END (GitHub #1397) */

        testPhoneGap : function () {
            var Browser = aria.core.Browser;

            // -----------------------------------------------------------------

            Aria.$window = {
                cordova : {},
                device : {}
            };
            this.assertTrue(Browser.isPhoneGap(), "Having global cordova means on PhoneGap");

            // -----------------------------------------------------------------

            this.reset();
            Aria.$window = {
                device : {
                    phonegap : "yeah!"
                }
            };
            this.assertTrue(Browser.isPhoneGap(), "Having global phonegap means on PhoneGap");

            // -----------------------------------------------------------------

            this.reset();
            Aria.$window = {
                device : "what?"
            };
            this.assertFalse(Browser.isPhoneGap(), "Missing globals means not on PhoneGap");
        },

        /**
         * Sets the document.documentElement value of the current window to the given value.
         *
         * @param value The value to set.
         *
         * @return The given value.
         */
        _setDocumentElementStyle : function(value) {
            Aria.$window = {
                document : {
                    documentElement : {
                        style : value
                    }
                }
            };

            return value;
        },

        test2DSupported : function () {
            var Browser = aria.core.Browser;

            // ------------------------------------------- native implementation

            this._setDocumentElementStyle({"transform" : "yeah!"});
            this.assertTrue(Browser.is2DTransformCapable(), "2D transform should be natively supported");

            // ----------------------------------------------- browser dependent

            this.reset();
            this._setDocumentElementStyle({"MozTransform" : "o yeah!"});
            this.assertTrue(Browser.is2DTransformCapable(), "2D transform should be -moz supported");

            // ------------------------------------------------------ no support

            this.reset();
            this._setDocumentElementStyle({"missing" : "transform"});
            this.assertFalse(Browser.is2DTransformCapable(), "2D transform shouldn't be supported");
        },

        test3DSupported : function () {
            var Browser = aria.core.Browser;

            // ------------------------------------------- native implementation

            this._setDocumentElementStyle({"perspective" : "yeah!"});
            this.assertTrue(Browser.is3DTransformCapable(), "3D transform should be natively supported");

            // ----------------------------------------------- browser dependent

            this.reset();
            this._setDocumentElementStyle({"OPerspective" : "o yeah!"});
            this.assertTrue(Browser.is3DTransformCapable(), "3D transform should be -o supported");

            // ------------------------------------------------------ no support

            this.reset();
            this._setDocumentElementStyle({"missing" : "perspective"});
            this.assertFalse(Browser.is3DTransformCapable(), "3D transform shouldn't be supported");
        }
        /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1397) */
        ,
        testDeprecation : function() {
            var Browser = aria.core.Browser;

            // -----------------------------------------------------------------

            Browser.init();
            var supportsPropertyDescriptors = Browser.supportsPropertyDescriptors();

            // -----------------------------------------------------------------

            var properties = Browser._deprecatedProperties;

            aria.utils.Array.forEach(properties, function(property) {
                var name = property.name;
                var type = property.type;
                var loggingMessage = property.loggingMessage;

                // -------------------------------------------------------------

                var called = false;
                if (type == "attribute" && supportsPropertyDescriptors) {
                    var dummy = Browser[name];
                    called = true;
                } else if (type == "method") {
                    Browser[name]();
                    called = true;
                }

                // -------------------------------------------------------------

                if (called) {
                    this.assertErrorInLogs(loggingMessage, 1);
                }
            }, this);
        }
        /* BACKWARD-COMPATIBILITY-END (GitHub #1397) */
    }
});
