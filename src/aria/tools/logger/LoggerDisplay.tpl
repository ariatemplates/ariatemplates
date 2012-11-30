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

// Template to display highlighting informations in subwindow
// aria.tools.logger.LoggerDisplay
{Template {
    $classpath : 'aria.tools.logger.LoggerDisplay',
    $hasScript : true
}}

    {macro main()}
        
        <div style="padding: 10px;">
        
        <div style="text-align:center; padding:5px; background:#F3F3F3; border:solid 1px #DDDDDD; margin-bottom:10px;">    
            {@aria:Button {
                label : "Clean",
                onclick : {
                    fn : moduleCtrl.clean,
                    scope: moduleCtrl
                }
            }/}
        </div>
        
        <table style="width:100%" cellpadding="3" cellspacing="0">
            <thead>
                <tr style="color:white; border-bottom:solid 1px #444444; font-weight:bold;">
                    <th style="border-right:solid 1px white; width:3em;"></th>
                    <th style="background:#444;border-right:solid 1px white; width:10em;">Class Name</th>
                    <th style="background:#444;border-right:solid 1px white; width:7em;">Message Id</th>
                    <th style="background:#444;border-right:solid 1px white;">Message</th>
                    <th style="background:#444;">Data</th>
                </tr>
            </thead>
            
            <tbody>
                {foreach log inArray data.logs}
                    <tr style="background:
                        {if (log.type==aria.core.Log.LEVEL_DEBUG)}#DDDDDD{/if} // light grey
                        {if (log.type==aria.core.Log.LEVEL_INFO)}#AADDFF{/if} // blue
                        {if (log.type==aria.core.Log.LEVEL_WARN)}#FFDD44{/if} // yellow
                        {if (log.type==aria.core.Log.LEVEL_ERROR)}#FF6666{/if} // red
                    ">
                        <td style="border-right:solid 1px white; text-align:middle; border-top:solid 1px #444444;">
                            ${log.date}
                        </td>
                        <td style="border-right:solid 1px white; border-top:solid 1px #444444;">
                            ${log.className}
                        </td>
                        <td style="border-right:solid 1px white; border-top:solid 1px #444444;">
                            ${log.msgId|empty:"&nbsp;"}
                        </td>
                        <td style="border-right:solid 1px white; border-top:solid 1px #444444;"> 
                            ${log.msg|empty:"&nbsp;"}
                        </td >
                        <td style="border-top:solid 1px #444444;">
                            {if (log.object)}
                                {@aria:Template {
                                    defaultTemplate : "aria.tools.common.ObjectTreeDisplay",
                                    data: {
                                        content : log.object,
                                        title : "data",
                                        showDepth : 0
                                    }
                                }/}
                            {else/}
                                &nbsp;
                            {/if}
                        </td>
                    </tr>
                {/foreach}
            </tbody>
            
        </table>
        
        </div>
        
            
    {/macro}
    
    

{/Template}
