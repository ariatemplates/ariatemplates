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
 * Test case for aria.modules.requestHandler.environment.RequestHandler.js
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.requestHandler.environment.RequestHandlerTestCase',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ["aria.modules.requestHandler.environment.RequestHandler",
            "test.aria.modules.test.jsonSerializers.FirstJsonSerializer"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.__serializer = new test.aria.modules.test.jsonSerializers.FirstJsonSerializer();
        this._requestHandler = aria.modules.requestHandler.environment.RequestHandler;
    },
    $destructor : function () {
        this._requestHandler = null;
        this.__serializer.$dispose();
        this.__serializer = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        testGetSetRequestHandler : function () {
            var rhImpl;

            rhImpl = this.__getRequestHandlerImplementation();
            this.assertEquals(rhImpl, "aria.modules.requestHandler.JSONRequestHandler"); // default bean definition

            aria.core.AppEnvironment.setEnvironment({
                "requestHandler" : {
                    implementation : "MyCustomImplementation"
                }
            });

            rhImpl = this.__getRequestHandlerImplementation();
            this.assertEquals(rhImpl, "MyCustomImplementation"); // user defined settings

            aria.core.AppEnvironment.setEnvironment({});

            rhImpl = this.__getRequestHandlerImplementation();
            this.assertEquals(rhImpl, "aria.modules.requestHandler.JSONRequestHandler"); // default bean definition
        },

        testGetSetRequestJsonSerializer : function () {
            var settings = this.__getJsonSerializeSettings(); // user defined settings
            this.assertTrue(settings.options && settings.options.encodeParameters === true);
            this.assertFalse("instance" in settings);

            aria.core.AppEnvironment.setEnvironment({
                "requestJsonSerializer" : {
                    options : {
                        msg : "msg"
                    }
                }
            });
            settings = this.__getJsonSerializeSettings(); // user defined settings
            this.assertTrue(settings.options && settings.options.msg == "msg");
            this.assertFalse("instance" in settings);

            aria.core.AppEnvironment.setEnvironment({
                "requestJsonSerializer" : {
                    instance : this.__serializer,
                    options : {
                        msg : "msg"
                    }
                }
            });

            settings = this.__getJsonSerializeSettings(); // user defined settings
            this.assertTrue(settings.options && settings.options.msg == "msg");
            this.assertTrue(settings.instance == this.__serializer);

            aria.core.AppEnvironment.setEnvironment({});

            settings = this.__getJsonSerializeSettings(); // user defined settings
            this.assertTrue(settings.options && settings.options.encodeParameters === true);
            this.assertFalse("instance" in settings);
        },

        __getRequestHandlerImplementation : function () {
            return this._requestHandler.getRequestHandlerCfg().implementation;
        },

        __getJsonSerializeSettings : function () {
            return this._requestHandler.getRequestJsonSerializerCfg();
        }
    }
});
