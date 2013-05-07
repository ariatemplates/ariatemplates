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
  $classpath: "test.aria.templates.inheritance.simple.ChildTemplate",
  $extends: "test.aria.templates.inheritance.simple.ParentTemplate",
  $hasScript: true,
  $res: {
    cartoonsNew: "test.aria.templates.inheritance.simple.CartoonsChild"
  }
}}

  {var a = data.One/}

  {macro myMacro2()}
    <div>a = ${a}</div>
//    Test if the parent variables are inherited by the child template
    <div>b = ${b}</div>
//  Test the existence and usability of $ParentTemplate reference
    {call $ParentTemplate.myMacro2()/}
  {/macro}

  {macro myMacro4()}
   <div>${myMethod("works")}</div>
   <div>script static ${TOYS_NUMBER}</div>
   <div>script resources ${this.toys.cars.ferrari}</div>
  {/macro}

  {macro myMacro5()}
   <div>${myParentMethod()}</div>
   <div>${myMethod1()}</div>
   <div>${$ParentTemplate.myMethod1()}</div>
   <div>parentscript static ${BOOKS_NUMBER}</div>
   <div>parentscript resources ${this.books.literature.england}</div>
   <div>parent res ${this.cartoons.heidi.friend}</div>
   <div>parent res ${this.$ParentTemplate.cartoonsNew.heidi.friend}</div>
   <div>overridden res ${this.cartoonsNew.heidi.friend}</div>
  {/macro}


{/Template}
