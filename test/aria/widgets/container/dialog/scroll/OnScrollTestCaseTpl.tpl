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
   $classpath: "test.aria.widgets.container.dialog.scroll.OnScrollTestCaseTpl"
}}
    {macro main()}
        <div style="position:absolute;overflow:auto;width:20%;height:20%;" {id "myDiv"/}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mauris turpis, gravida et porta vel, auctor vel lectus. Quisque leo felis, malesuada et ornare id, tempus non neque. Donec turpis mauris, dignissim sit amet rutrum non, vehicula vitae est. Duis velit leo, condimentum in euismod nec, luctus eu sem. Sed pretium sagittis nisl sed posuere. Sed ut leo nibh, sit amet sollicitudin ligula. Aliquam non purus nisl. Nunc ut tellus nec diam convallis elementum sit amet a purus. Ut molestie, sem et vulputate facilisis, urna nulla ultricies metus, in aliquet turpis eros non nunc. Donec at turpis vel ante dapibus dignissim tincidunt quis eros. Integer eleifend congue tortor, tempor egestas eros mollis posuere. Phasellus sit amet lorem sed turpis aliquam dignissim a sit amet nisl. Cras malesuada gravida pretium. Vestibulum luctus vehicula gravida. Cras ut est sed leo posuere venenatis nec non mauris. Vestibulum in tellus dui. Vivamus suscipit tempus dolor a varius.

            Mauris ac ultrices nisl. Fusce sollicitudin placerat accumsan. Ut eu ante velit. Duis blandit tortor quis tellus sollicitudin eu interdum enim lacinia. Pellentesque vel leo ipsum. Nulla eget lorem quis quam laoreet luctus. Nam ut purus ut enim venenatis cursus in viverra metus. Pellentesque sed lorem odio. Vestibulum et ipsum et ante ullamcorper luctus. Cras eleifend quam sit amet mi ullamcorper non lacinia arcu hendrerit. Nulla leo metus, eleifend vel egestas at, consectetur nec enim. Donec dui orci, rutrum ac rhoncus et, ultrices non est. Integer magna leo, viverra a egestas ut, placerat in lorem. Donec felis purus, interdum cursus consectetur vel, suscipit sit amet sapien. Duis tempus euismod purus eu rhoncus. Maecenas vestibulum velit metus, in blandit leo. Curabitur nisl nulla, aliquam id convallis vitae, aliquam sit amet justo. Nunc erat eros, venenatis eget egestas at, blandit sit amet dui. Quisque fringilla, risus ac varius dignissim, ante risus porta nisl, a volutpat erat sem ut lectus.

            Maecenas hendrerit porta ligula nec sollicitudin. In bibendum sagittis dolor ac feugiat. Cras ligula tellus, interdum sed elementum congue, mollis eu libero. Sed nibh massa, rhoncus id iaculis non, auctor in neque. Ut sollicitudin convallis ultricies. Mauris tempor tincidunt pharetra. Aliquam auctor arcu ac lectus ultrices imperdiet. Maecenas tristique, nulla eget dignissim faucibus, orci risus tempus ipsum, et commodo diam erat id ligula. Sed hendrerit tortor sem, eu molestie odio. Sed viverra eros nec diam mollis consequat. Morbi ultricies rhoncus velit, vel elementum tellus fringilla sit amet. Integer fringilla semper ante, sit amet mollis libero varius nec. Quisque sit amet sem libero. Suspendisse sed magna diam, quis faucibus lacus. Phasellus dictum, neque quis tincidunt tincidunt, augue sem varius ipsum, in interdum purus metus id mauris.

            Nunc vitae lectus augue. Fusce eu tellus consequat orci facilisis sagittis. Sed eu adipiscing nibh. Maecenas hendrerit rutrum gravida. Vivamus consectetur velit in mauris accumsan dictum. Donec hendrerit, est nec accumsan eleifend, elit ipsum fermentum sem, et semper nulla purus sed nulla. Nunc sollicitudin pharetra massa. Praesent quis pulvinar purus. In imperdiet lectus nec ipsum gravida dapibus. Donec cursus laoreet ullamcorper.
        </div>
        {@aria:Dialog {
            contentMacro: "dialogContent",
            modal: true,
            bind: {
                visible: {
                    to: "dialogVisible",
                    inside: data
                }
            }
        }}
        {/@aria:Dialog}
        <div style="height:6000px">&nbsp;</div>
    {/macro}

    {macro dialogContent()}
        <div>
            My test
        </div>
    {/macro}

{/Template}