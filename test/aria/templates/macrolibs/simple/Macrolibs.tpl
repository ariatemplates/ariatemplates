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
    $classpath: "test.aria.templates.macrolibs.simple.Macrolibs",
    $macrolibs : {
      libOne: "test.aria.templates.macrolibs.simple.Lib1",
      libTwo: "test.aria.templates.macrolibs.simple.Lib2",
      libThree :"test.aria.templates.macrolibs.simple.Lib3"
    }
}}

    {macro main()}
       <div id="test1">{call libOne.helloWorld() /} </div>
       <div id="test2">{call libOne.print("thelonious") /} </div>
       <div id="test3">{call libOne.printArgs() /} </div>
       <div id="test4">{call libOne.modCtrlDog(moduleCtrl) /} </div>
       <div id="test5">{call libOne.libDog(moduleCtrl) /} </div>
       <div id="test6">{call libTwo.helloWorld() /} </div>
       <div id="test7">{call libThree.helloWorld() /} </div>
    {/macro}

{/Template}
