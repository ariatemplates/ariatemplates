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
    $classpath:"test.aria.templates.scrollControl.testTwo.MyDialogTemplate",
    $hasScript:true
}}

    {macro main()}
        {section {
            id : 'introduction',
            type : 'DIV'
        }}
            <h1>Scroll to the bottom of this dialog and click on "more" to display the rest</h1>
            <p style='width: 220px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed,
            dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
            Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
            Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.
            Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit
            sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam
            sodales hendrerit. Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa
            suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper
            nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis.
            Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas.
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula.
            Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam.
            Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis
            lectus, et tristique ligula justo vitae magna. Aliquam convallis sollicitudin purus. Praesent aliquam,
            enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate
            sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet.
            Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi.
            Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem
            varius purus. Curabitur eu amet.</p>

        {/section}


        {section {
            id : 'content',
            macro : 'contentDisplay',
            bindRefreshTo : [{
                to : 'fullDisplay',
                inside : data
            }]
        } /}

    {/macro}




    {macro contentDisplay()}

        {if !data.fullDisplay}
            <hr/>
        {else/}
            <hr/>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed,
            dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
            Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
            Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.
            Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
            Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit
            sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam
            sodales hendrerit. Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa
            suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper
            nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis.
            Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas.
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula.
            Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam.
            Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis
            lectus, et tristique ligula justo vitae magna. Aliquam convallis sollicitudin purus. Praesent aliquam,
            enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate
            sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet.
            Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi.
            Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem
            varius purus. Curabitur eu amet.</p>
            <hr/>
        {/if}

    {/macro}

{/Template}
