/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath: "test.aria.jsunit.sinon.SinonTest",
    $extends: "aria.jsunit.SinonTestCase",
    $prototype: {
        testSpy: function () {
            var spy = this.$sinon.spy();
            spy(12);
            this.assertTrue(spy.calledOnce, "Spy should have been called once");
            this.assertTrue(spy.calledWith(12), "Spy should have been called with 12");

            var Constructor = function (number) {
                this.number = 12 + number;
            };
            var spyClass = this.$sinon.spy(Constructor);
            var instance = new spyClass(8);
            this.assertTrue(spyClass.calledWithNew(), "Spy class should have been called with new operator");
            this.assertEquals(spyClass.getCall(0).args[0], 8);
        },

        testStub : function () {
            var stub = this.$sinon.stub().returns(15);
            this.assertEquals(stub(3), 15, "Stub should return %2, got %1");

            var object = {
                saySomething : function () {
                    return "something";
                }
            };
            this.$sinon.stub(object, "saySomething").returns(12);
            this.assertEquals(object.saySomething(), 12, "Stub should return %2, got %1");
        },

        testMock : function () {
            var object = {
                sayOne : function () {
                    return 1;
                }
            };

            var mock = this.$sinon.mock(object);
            // Say in advance that we expect it to be called at most twice with some arguments
            mock.expects("sayOne").atMost(2).withArgs(true);

            object.sayOne(true);
            object.sayOne(true, false);

            mock.verify();
        }
    }
});
