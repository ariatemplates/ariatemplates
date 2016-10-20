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
 * Test for transports used by IO
 */
Aria.classDefinition({
    $classpath : "test.aria.core.io.IOTransportTestCase",
    $extends : "test.aria.core.io.IOBase",
    $dependencies : ["test.aria.core.test.IOFilterSample", "aria.utils.Dom", "aria.utils.String", "aria.utils.Xml"],
    $prototype : {

        /**
         * Resets any transport configuration, removes any listeners, and removes timers.
         */
        tearDown : function () {
            aria.core.IO.updateTransports({
                "sameDomain" : "aria.core.transport.XHR",
                "crossDomain" : "aria.core.transport.XHR",
                "jsonp" : "aria.core.transport.JsonP",
                "local" : "aria.core.transport.Local",
                "iframe" : "aria.core.transport.IFrame"
            });
            this.$IOBase.tearDown.call(this);
        },

        /**
         * Helper creating custom transports to be used by the tests.
         * @protected
         */
        _customTransports : function () {
            /**
             * Base Custom Transport class.
             */
            var BaseXHR = Aria["classDefinition"]({
                $classpath : "myApplication.transports.BaseXHR",
                $constructor : function () {},
                $prototype : {}
            });

            /**
             * Custom Transport class for same origin requests.
             */
            Aria["classDefinition"]({
                $classpath : "myApplication.transports.SameDomainCustomTransport",
                $extends : BaseXHR,
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for different origin requests.
             */
            Aria["classDefinition"]({
                $classpath : "myApplication.transports.CrossDomainCustomTransport",
                $extends : BaseXHR,
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for JsonP requests.
             */
            Aria["classDefinition"]({
                $classpath : "myApplication.transports.JsonPCustomTransport",
                $extends : BaseXHR,
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for local requests.
             */
            Aria["classDefinition"]({
                $classpath : "myApplication.transports.LocalCustomTransport",
                $extends : BaseXHR,
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for IFrame requests.
             */
            Aria["classDefinition"]({
                $classpath : "myApplication.transports.IFrameCustomTransport",
                $extends : BaseXHR,
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });
        },

        /**
         * Tests the default transports set by the framework then sets and tests custom transports.
         */
        testSetTransports : function () {
            // Test the default settings for transports in IO.
            var transports = aria.core.IO.getTransports();
            this.assertTrue(transports.sameDomain === "aria.core.transport.XHR");
            this.assertTrue(transports.crossDomain === "aria.core.transport.XHR");
            this.assertTrue(transports.jsonp === "aria.core.transport.JsonP");
            this.assertTrue(transports.local === "aria.core.transport.Local");
            this.assertTrue(transports.iframe === "aria.core.transport.IFrame");

            // Test the loading of custom transports and the storing of the transport class names and paths in IO.
            this._customTransports();
            aria.core.IO.updateTransports({
                "sameDomain" : "myApplication.transports.SameDomainCustomTransport",
                "crossDomain" : "myApplication.transports.CrossDomainCustomTransport",
                "jsonp" : "myApplication.transports.JsonPCustomTransport",
                "local" : "myApplication.transports.LocalCustomTransport",
                "iframe" : "myApplication.transports.IFrameCustomTransport"
            });
            transports = aria.core.IO.getTransports();
            var sameDomainTransport = Aria.getClassRef(transports.sameDomain);
            var crossDomainTransport = Aria.getClassRef(transports.crossDomain);
            var jsonpTransport = Aria.getClassRef(transports.jsonp);
            var localTransport = Aria.getClassRef(transports.local);
            var iframeTransport = Aria.getClassRef(transports.iframe);

            this.assertTrue(aria.utils.Type.isInstanceOf(sameDomainTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(crossDomainTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(jsonpTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(localTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(iframeTransport, 'myApplication.transports.BaseXHR'));
        }
    }
});
