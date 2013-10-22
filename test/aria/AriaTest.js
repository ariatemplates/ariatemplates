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
    $classpath : "test.aria.AriaTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.test.ClassA", "test.aria.test.ClassAbis", "test.aria.test.ClassAter",
            "test.aria.test.ClassB", "test.aria.test.ClassC", "test.aria.test.ClassD", "test.aria.test.ClassS"],
    $prototype : {
        /**
         * Test errors that can be triggered when using Aria.classDefinition
         */
        testClassDefinitionErrors : function () {

            // No arg provided
            this.callAriaClassDefError();
            this.assertErrorInLogs(Aria.NULL_PARAMETER);

            // No classpath provided
            this.callAriaClassDefError({});
            this.assertErrorInLogs(Aria.NULL_CLASSPATH);

            this.callAriaClassDefError({
                $class : 'Myclass'
            });
            this.assertErrorInLogs(Aria.NULL_CLASSPATH);

            this.callAriaClassDefError({
                $package : 'mypackage'
            });
            this.assertErrorInLogs(Aria.NULL_CLASSPATH);

            // Invalid classpath
            this.callAriaClassDefError({
                $classpath : '.aria.test.ClassZ'
            });
            this.assertErrorInLogs(Aria.INVALID_PACKAGENAME_FORMAT);

            this.callAriaClassDefError({
                $classpath : 'test.aria.test.'
            });
            this.assertErrorInLogs(Aria.INVALID_CLASSNAME_FORMAT);

            // The following case only raises a warning:
            Aria.classDefinition({
                $classpath : 'te st.aria.test.ClassZ'
            });
            this.assertErrorInLogs(Aria.INVALID_PACKAGENAME_FORMAT);

            // Invalid classpath, defined through class and package:
            this.callAriaClassDefError({
                $class : 'ClassZ',
                $package : '.aria.test'
            });
            this.assertErrorInLogs(Aria.INVALID_PACKAGENAME_FORMAT);

            this.callAriaClassDefError({
                $class : '',
                $package : 'test.aria.test.'
            });
            this.assertErrorInLogs(Aria.INVALID_PACKAGENAME_FORMAT);

            // The following case only raises a warning:
            Aria.classDefinition({
                $class : 'ClassZ',
                $package : 'te st.aria.test'
            });
            this.assertErrorInLogs(Aria.INVALID_PACKAGENAME_FORMAT);

            this.callAriaClassDefError({
                $class : 'class',
                $package : 'test.aria.test'
            });
            this.assertErrorInLogs(Aria.INVALID_CLASSNAME_FORMAT);

            // Incoherent classpath, class and package
            this.callAriaClassDefError({
                $class : 'MyNewClassA',
                $package : 'test.aria',
                $classpath : 'test.aria.MyNewClassB'
            });

            // same package, different class names
            this.assertErrorInLogs(Aria.INCOHERENT_CLASSPATH);

            this.callAriaClassDefError({
                $class : 'MyNewClass',
                $package : 'test.aria.a',
                $classpath : 'test.aria.b.MyNewClass'
            });

            // same class name, different packages
            this.assertErrorInLogs(Aria.INCOHERENT_CLASSPATH);

            this.callAriaClassDefError({
                $class : 'aria.MyNewClass',
                $package : 'test',
                $classpath : 'test.aria.MyNewClass'
            });

            // invalid separation of class/package
            this.assertErrorInLogs(Aria.INCOHERENT_CLASSPATH);

            // Same class name as one of the class parents
            this.callAriaClassDefError({
                $classpath : 'test.aria.test.Assert',
                $extends : 'aria.jsunit.TestCase',
                $constructor : function () {}
            });
            this.assertErrorInLogs(Aria.DUPLICATE_CLASSNAME);

            // Invalid class names:
            this.callAriaClassDefError({
                $classpath : 'test.aria.test.classZ',
                $constructor : function () {}
            });
            this.assertErrorInLogs(Aria.INVALID_CLASSNAME_FORMAT);

            // Inherit from Singleton
            this.callAriaClassDefError({
                $classpath : 'test.aria.test.ClassSExtended',
                $extends : 'test.aria.test.ClassS'
            });
            this.assertErrorInLogs(Aria.CANNOT_EXTEND_SINGLETON);

        },

        /**
         * Call Aria.classDefinitionCheck that the call raises an exception.
         */
        callAriaClassDefError : function (def) {
            var raisedException = false;
            try {
                Aria.classDefinition(def);
            } catch (e) {
                raisedException = true;
            }
            this.assertTrue(raisedException, "Aria.classDefinition should have raised an exception");
        },

        /**
         * Test namespace creation
         */
        testNspace : function () {
            var global = Aria.$global;
            var w = Aria.nspace('');
            this.assertTrue(w == global);

            this.assertTrue(global.testXYZ == null);

            var n = Aria.nspace("testXYZ.testABC.testDEF");
            this.assertTrue(n == global.testXYZ.testABC.testDEF);

            n = Aria.nspace(".testABC");
            this.assertTrue(n == null);
            this.assertErrorInLogs(Aria.INVALID_NAMESPACE);

            n = Aria.nspace("testXYZ.testABC.");
            this.assertTrue(n == null);
            this.assertErrorInLogs(Aria.INVALID_NAMESPACE);

            n = Aria.nspace("testXYZ.default.z");
            this.assertTrue(n == null);
            this.assertErrorInLogs(Aria.INVALID_NAMESPACE);

            this.assertTrue(global['testXYZ'] != null);

            global['testXYZ'] = null;

            try {
                // delete on window don't work on IE 6/7/8
                delete global['testXYZ'];
            } catch (e) {}

            this.assertTrue(global['testXYZ'] == null);
        },

        /**
         * JS reserved words check
         */
        testCheckJsVarName : function () {
            this.assertFalse(Aria.checkJsVarName("extends"));
            this.assertFalse(Aria.checkJsVarName("class"));
            this.assertFalse(Aria.checkJsVarName("constructor"));
            this.assertTrue(Aria.checkJsVarName("name"));
            this.assertFalse(Aria.checkJsVarName("1a"));
            this.assertFalse(Aria.checkJsVarName("name#"));
        },

        /**
         * Test that a call to classDefinition results in an actual class function
         */
        testClassDefinition : function () {
            var ca = new test.aria.test.ClassA();
            var ca2 = new test.aria.test.ClassA("XYZ");

            // $ extensions validation
            this.assertEquals(ca.$class, 'ClassA');
            this.assertEquals(ca.$classpath, 'test.aria.test.ClassA');
            this.assertEquals(ca.$package, 'test.aria.test');

            // property validation
            this.assertEquals(ca.propertyA, 'valueA');
            this.assertEquals(ca2.propertyA, 'XYZ');
            this.assertEquals(ca.count, 0);

            // method call validation
            ca.methodA1();
            this.assertEquals(ca.count, 1);
            this.assertEquals(ca.methodA2('x'), 'xmA2');

            // test destructor
            ca.$dispose();
            this.assertTrue(ca.propertyA == null);
            this.assertTrue(ca.count == null);

            ca2.$dispose(); // call the destructor (mandatory when discarding an object)

            ca = null;
            ca2 = null;

            // definition with class and package:
            ca = new test.aria.test.ClassAbis();
            ca2 = new test.aria.test.ClassAbis("XYZ");

            // $ extensions validation
            this.assertEquals(ca.$class, 'ClassAbis');
            this.assertEquals(ca.$classpath, 'test.aria.test.ClassAbis');
            this.assertEquals(ca.$package, 'test.aria.test');

            // property validation
            this.assertEquals(ca.propertyA, 'valueA');
            this.assertEquals(ca2.propertyA, 'XYZ');
            this.assertEquals(ca.count, 0);

            // method call validation
            ca.methodA1();
            this.assertEquals(ca.count, 1);
            this.assertEquals(ca.methodA2('x'), 'xmA2');

            // test destructor
            ca.$dispose();
            this.assertTrue(ca.propertyA == null);
            this.assertTrue(ca.count == null);

            ca2.$dispose(); // call the destructor (mandatory when discarding an object)

            ca = null;
            ca2 = null;

            // definition with both $classpath and $package,$class
            ca = new test.aria.test.ClassAter();
            ca2 = new test.aria.test.ClassAter("XYZ");

            // $ extensions validation
            this.assertEquals(ca.$class, 'ClassAter');
            this.assertEquals(ca.$classpath, 'test.aria.test.ClassAter');
            this.assertEquals(ca.$package, 'test.aria.test');

            // property validation
            this.assertEquals(ca.propertyA, 'valueA');
            this.assertEquals(ca2.propertyA, 'XYZ');
            this.assertEquals(ca.count, 0);

            // method call validation
            ca.methodA1();
            this.assertEquals(ca.count, 1);
            this.assertEquals(ca.methodA2('x'), 'xmA2');

            // test destructor
            ca.$dispose();
            this.assertTrue(ca.propertyA == null);
            this.assertTrue(ca.count == null);

            ca2.$dispose(); // call the destructor (mandatory when discarding an object)
        },

        /**
         * Test first level of inheritance
         */
        testInheritance1 : function () {
            var cb = new test.aria.test.ClassB();
            var cb2 = new test.aria.test.ClassB("XYZ");

            this.assertTrue(cb.$class == 'ClassB');
            this.assertTrue(cb.$classpath == 'test.aria.test.ClassB');
            this.assertTrue(cb.$package == 'test.aria.test');

            // property validation
            this.assertTrue(cb.propertyA == 'valueA');
            this.assertTrue(cb2.propertyA == 'XYZ');
            this.assertTrue(cb.propertyB == 'valueB');
            this.assertTrue(cb.count === 0);

            // method call validation
            cb.methodA1();
            this.assertTrue(cb.count == 1);
            cb.methodB1();
            this.assertTrue(cb.count == 6);
            this.assertTrue(cb.methodA2('xy') == 'xymA2');
            this.assertTrue(cb.methodB2() == 'mB2-mA2');

            // test destructor
            cb.$dispose();
            this.assertTrue(cb.propertyA == null);
            this.assertTrue(cb.count == null);
            this.assertTrue(cb.propertyB == null);

            cb2.$dispose(); // call the destructor (mandatory when discarding an object)
        },

        /**
         * Test second level of inheritance
         */
        testInheritance2 : function () {
            var cc = new test.aria.test.ClassC();

            this.assertTrue(cc.$class == 'ClassC');
            this.assertTrue(cc.$classpath == 'test.aria.test.ClassC');
            this.assertTrue(cc.$package == 'test.aria.test');

            // property validation
            this.assertTrue(cc.propertyA == 'CLASS_C');
            this.assertTrue(cc.propertyB == 'valueB');
            this.assertTrue(cc.propertyC == 'valueC');
            this.assertTrue(cc.count == 1);

            // method call validation
            cc.methodA1();
            this.assertTrue(cc.count == 3);
            cc.methodB1();
            this.assertTrue(cc.count == 8);
            this.assertTrue(cc.methodA2('xy') == 'xymA2');
            this.assertTrue(cc.methodB2() == 'mC2-mB2-mA2-mC2');

            // test destructor
            cc.$dispose();
            this.assertTrue(cc.propertyA == null);
            this.assertTrue(cc.count == null);
            this.assertTrue(cc.propertyB == null);
            this.assertTrue(cc.propertyC == null);
        },

        /**
         * Test inherited constructor
         */
        testInheritance3 : function () {
            // this class has no $constructor defined, it will use the one from ClassC
            var instance = new test.aria.test.ClassD();
            this.assertTrue(instance.propertyA == 'CLASS_C');
            this.assertTrue(instance.propertyB == 'valueB');
            this.assertTrue(instance.propertyC == 'valueC');
            this.assertTrue(instance.count == 1);
            instance.$dispose();
        },

        /**
         * Test singleton objects
         */
        testInheritanceForSingletons : function () {
            var cs = test.aria.test.ClassS;

            this.assertTrue(typeof(cs) == 'object');

            this.assertTrue(cs.$class == 'ClassS');
            this.assertTrue(cs.$classpath == 'test.aria.test.ClassS');
            this.assertTrue(cs.$package == 'test.aria.test');

            // property validation
            this.assertTrue(cs.propertyA == 'CLASS_C');
            this.assertTrue(cs.propertyB == 'valueB');
            this.assertTrue(cs.propertyC == 'valueC');
            this.assertTrue(cs.count == 1);

            // method call validation
            cs.methodA1();
            this.assertTrue(cs.count == 3);
            cs.methodB1();
            this.assertTrue(cs.count == 8);
            this.assertTrue(cs.methodA2('xy') == 'xymA2');
            this.assertTrue(cs.methodB2() == 'mC2-mB2-mA2-mC2');
        },

        /**
         * Test some JS statements to make sure they behave the same on all browsers
         */
        testJsStatements : function () {
            var x = {};
            this.assertTrue(typeof(this.testJsStatements) == 'function');
            this.assertTrue(typeof(x) == 'object');

            var y = {
                sth : "XXX"
            };
            this.assertTrue(x.constructor == Object);
            this.assertTrue(y.constructor == Object);

        },

        /**
         * Test that it is possible to access Aria.$frameworkWindow even after changing the document domain<br />
         * WARNING <br />
         * When you set the domain you start having problems with iframes, security concerns are raised by browser
         * because even if the domain is the same for the browser the two frames have different domain. This is
         * documented here https://developer.mozilla.org/en-US/docs/DOM/document.domain <br />
         * If you set in both the same domain, they'll start working again, nonetheless when you submit a form having
         * the child iframe as target (file upload) you still have security error when you try to read the answer.<br />
         * For this reason, file upload cannot work if you set the domain. In order to let other tests pass, this one is
         * disabled.
         */
        DISABLED_testDomainChange : function () {
            var title = Aria.$frameworkWindow.document.title;
            Aria.$global.document.domain = Aria.$global.document.domain;
            this.assertTrue(Aria.$frameworkWindow.document.title == title);
        }
    }
});
