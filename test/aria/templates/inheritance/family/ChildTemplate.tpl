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

{Template {
    $classpath: "test.aria.templates.inheritance.family.ChildTemplate",
    $extends: "test.aria.templates.inheritance.family.ParentTemplate",
    $macrolibs: {
      libOne: "test.aria.templates.inheritance.family.LibChild"
    },
    $hasScript: true,
    $res: {
      cartoonsNew: "test.aria.templates.inheritance.family.CartoonsChild"
    }
}}

  {var b = 3/}

  {macro main()}
    // test vars
    <div>vargp = ${varGP}</div>
    <div>b = ${b}</div>
    // test macros
    {call myMacroGrandParent()/}
    {call myMacro3()/}
    {call $ParentTemplate.myMacro2()/}
    {call myMacro2()/}
    // test resources
    <div>${this.cartoons.heidi.friend}</div>
    <div>${this.cartoonsNew.heidi.friend}</div>
    <div>${this.$ParentTemplate.cartoonsNew.heidi.friend}</div>
    <div>${this.$GrandParentTemplate.cartoonsNew.heidi.friend}</div>
    // test script methods
    <div>${myGrandParentMethod()}</div>
    <div>${myMethod1()}</div>
    <div>${$GrandParentTemplate.myMethod1()}</div>
    // test script resources
    <div>resources ${this.books.literature.france}</div>
    // test library inheritance
    {call libGP.print("output")/}
    {call libOne.print("output")/}
    ${libGP.myMacroScript("output")}
    // test CSS inheritance
    <h1 {id "titleoneid"/}>title 1</h1>
  {/macro}

    {macro myMacro2()}
    <div>child mymacro2</div>
  {/macro}


{/Template}
