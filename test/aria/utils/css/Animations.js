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
    $classpath : "test.aria.utils.css.Animations",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.css.Animations", "aria.utils.Dom"],
    $prototype : {
        setUp : function () {
            this.Detect = (function () {
                function cssTransitions () {
                    var document = Aria.$window.document;
                    var div = document.createElement("div");
                    var p, ext, pre = ["ms", "O", "Webkit", "Moz"];
                    for (p in pre) {
                        if (div.style[pre[p] + "Transition"] !== undefined) {
                            ext = pre[p];
                            break;
                        }
                    }
                    div = null;
                    return ext;
                }
                return {
                    "cssTransitions" : cssTransitions
                };
            }());

            if (this.Detect.cssTransitions()) {
                var document = Aria.$window.document;
                var testArea = document.createElement("div");
                var anime = new aria.utils.css.Animations();
                var anime2 = new aria.utils.css.Animations();
                var anime3 = new aria.utils.css.Animations();

                testArea.id = "testForAnimations";
                document.body.appendChild(testArea);
                this.playgroundTestArea = testArea;

                var css = ".not-visible {display: none;} .visible {display: block;} .page {top:0; left:0; position:absolute; width: 100%; min-height: 100%; border: 0;}";
                var head = document.getElementsByTagName('head')[0];
                var style = document.createElement('style');

                style.type = "text/css";
                style.appendChild(document.createTextNode(css));
                head.appendChild(style);

                this.animate = anime;
                this.animate2 = anime2;
                this.animate3 = anime3;

                this.animate.$on({
                    "animationend" : this.animationComplete,
                    scope : this
                });

                this.animate2.$on({
                    "animationend" : this.animationCombinedComplete,
                    scope : this
                });

                this.animate3.$on({
                    "animationend" : this.animationCombinedComplete2,
                    scope : this
                });

                //Validates that the animations CSS rules are well loaded in their own element
                this.assertNotNull(document.getElementById("xCsspool1"));

                this.divPage1 = document.createElement('div');
                this.divPage2 = document.createElement('div');

                this.divPage1.innerHTML = "<div id=\"page1\" class=\"page\"><div class=\"container\"><h1 class=\"text-center\">First Page</h1><p class=\"lead text-center\">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p></div></div></div>";
                this.divPage2.innerHTML = "<div id=\"page2\" class=\"page not-visible\"><div class=\"container\"><div class=\"hero-unit\"><h1>After Animation</h1><p>CSS3</p><p><a class=\"btn btn-primary btn-large\">Learn more</a></p></div></div></div>";

                this.playgroundTestArea.appendChild(this.divPage1);
                this.playgroundTestArea.appendChild(this.divPage2);

                this.from = aria.utils.Dom.getElementById('page1');
                this.to = aria.utils.Dom.getElementById('page2');
            }
        },

        tearDown : function () {
            if (this.Detect.cssTransitions()) {
                this.playgroundTestArea.parentNode.removeChild(this.playgroundTestArea);
                this.playgroundTestArea = null;
                this.animate.$dispose();
                this.animate2.$dispose();
                this.animate3.$dispose();
            }
        },

        testAsyncAnimations : function () {
            if (!this.Detect.cssTransitions()) {
                this.notifyTestEnd('testAsyncAnimations');
            } else {
                var cfg = {
                    from : this.from,
                    to : this.to,
                    type : 3,
                    hiddenClass : 'not-visible'
                };
                this.animate.start('slide', cfg);
            }
        },

        animationComplete : function (evt) {
            var cfg;
            /* test animation complete*/
            switch (evt.animation) {
                case "slide" :
                    this.assertEquals(this.from.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.to.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.to,
                        to : this.from,
                        type : 3,
                        reverse : true,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('slide', cfg);
                    break;

                case "slide reverse" :
                    this.assertEquals(this.to.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.from.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.from,
                        to : this.to,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('slideup', cfg);
                    break;

                case "slideup" :
                    this.assertEquals(this.from.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.to.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.to,
                        to : this.from,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('slidedown', cfg);
                    break;

                case "slidedown" :
                    this.assertEquals(this.to.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.from.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.from,
                        to : this.to,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('fade', cfg);
                    break;

                case "fade" :
                    this.assertEquals(this.from.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.to.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.to,
                        to : this.from,
                        reverse : true,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('fade', cfg);
                    break;

                case "fade reverse" :
                    this.assertEquals(this.to.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.from.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.from,
                        to : this.to,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('pop', cfg);
                    break;

                case "pop" :
                    this.assertEquals(this.from.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.to.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.to,
                        to : this.from,
                        reverse : true,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('pop', cfg);
                    break;

                case "pop reverse" :
                    this.assertEquals(this.to.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.from.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.from,
                        to : this.to,
                        reverse : false,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('flip', cfg);
                    break;

                case "flip" :
                    this.assertEquals(this.from.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.to.className, 'page', 'The ending div is not displayed');

                    cfg = {
                        from : this.to,
                        to : this.from,
                        reverse : true,
                        hiddenClass : 'not-visible'
                    };
                    this.animate.start('flip', cfg);
                    break;

                case "flip reverse" :
                    this.assertEquals(this.to.className, 'page not-visible', 'The starting div is not hidden');
                    this.assertEquals(this.from.className, 'page', 'The ending div is not displayed');
                    this.AnimationCombined();
                    break;

            }
        },

        AnimationCombined : function () {
            var cfg = {
                from : this.from,
                reverse : true,
                hiddenClass : "not-visible"
            };

            var cfg2 = {
                to : this.to,
                hiddenClass : "not-visible"
            };

            this.animate2.start("slide", cfg);
            this.animate3.start("slidedown", cfg2);
        },

        animationCombinedComplete : function () {
            this.assertEquals(this.from.className, 'page not-visible', 'The starting div is not hidden');
            this.notifyTestEnd('testAsyncAnimations');
        },

        animationCombinedComplete2 : function () {
            this.assertEquals(this.to.className, 'page', 'The ending div is not displayed');
        }
    }
});
