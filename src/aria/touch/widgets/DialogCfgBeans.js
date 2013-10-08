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

Aria.beanDefinitions({
    $package : "aria.touch.widgets.DialogCfgBeans",
    $description : "Dialog config beans",
    $namespaces : {
        "common" : "aria.widgetLibs.CommonBeans",
        "popupWidget" : "aria.touch.widgets.PopupCfgBeans"
    },
    $beans : {
        "DialogCfg" : {
            $type : "popupWidget:PopupCfg",
            $description : "Configuration object for the aria.touch.widgets.Dialog",
            $properties : {
                "bind" : {
                    $type : "popupWidget:PopupCfg.$properties.bind",
                    $properties : {
                        "isVisible" : {
                            $type : "common:BindingRef",
                            $description : "[DEPRECATED] Please use visible instead"
                        }
                    }
                }
            }
        }
    }
});
