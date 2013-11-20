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
 * TextArea widget. Bindable widget providing bi-directional bind of 'value' and on 'type' event callback.
 */
Aria.classDefinition({
    $classpath : "aria.html.TextArea",
    $extends : "aria.html.TextInput",
    $dependencies : ["aria.html.beans.TextAreaCfg"],
    $constructor : function (cfg, context, line) {
        this.$TextInput.constructor.call(this, cfg, context, line);

        // TextInput adds a type attribute which is not needed and therefore removed
        delete cfg.attributes.type;
    },
    $prototype : {
        /**
         * Tagname to use to generate the markup of the widget
         */
        tagName : "textarea",

        /**
         * Classpath of the configuration bean for this widget.
         */
        $cfgBean : "aria.html.beans.TextAreaCfg.Properties",

        writeMarkup : function (out) {
            //skip direct parent to allow self-closing usage of the textarea widget
            this.$Element.writeMarkupBegin.call(this, out);
            this.$Element.writeMarkupEnd.call(this, out);
        }
    }
});
