/**
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
 * Beans describing the configuration object for frames.
 * @class aria.widgets.frames.CfgBeans
 */
Aria.beanDefinitions({
	$package : "aria.widgets.frames.CfgBeans",
	$description : "Beans describing the configuration object for frames.",
	$namespaces : {
		// add external namespaces here
		"json" : "aria.core.JsonTypes",
		"templates" : "aria.templates.CfgBeans"
	},
	$beans : {
		"FrameCfg" : {
			$type : "json:Object",
			$description : "Parameter of the createFrame method.",
			$properties : {
				"id" : {
					$type : "json:String",
					$description : "Id of the top level widget. Used for generated test ids."
				},
				"skinnableClass" : {
					$type : "json:String",
					$description : "Name of the skinnable class to use when looking for the skin class.",
					$sample : "Button"
				},
				"sclass" : {
					$type : "json:String",
					$description : "Name of the skin class",
					$sample : "std"
				},
				"skinObject" : {
					$type : "json:ObjectRef",
					$description : "Skin object corresponding to the skin class in the skinnable class. If not provided, it is completed automatically by calling aria.widgets.AriaSkinInterface.getSkinObject(skinnableClass,sclass)."
				},
				"state" : {
					$type : "json:String",
					$description : "Name of the state to use."
				},
				"stateObject" : {
					$type : "json:ObjectRef",
					$description : "Automatically filled with skinObject.states[state]."
				},
				"width" : {
					$type : "json:Integer",
					$description : "External width of the frame, or -1 if the width of the frame should depend on its content. Can be ignored by some types of frames.",
					$default : -1
				},
				"height" : {
					$type : "json:Integer",
					$description : "External height of the frame, or -1 if the height of the frame should depend on its content. Can be ignored by some types of frames.",
					$default : -1
				},
				"cssClass" : {
					$type : "json:String",
					$description : "CSS class to be used inside the frame.",
					$default : ""
				},
				"scrollBarX" : {
					$type : "json:Boolean",
					$description : "A boolean whether the tab is disabled",
					$default : true
				},
				"scrollBarY" : {
					$type : "json:Boolean",
					$description : "A boolean whether the tab is disabled",
					$default : true
				},
				"printOptions" : {
					$type : "templates:PrintOptions"
				},
				"block" : {
					$type : "json:Boolean",
					$description : "This frames needs to be a block"
				},
				"tooltipLabels" : {
					$type : "json:Array",
					$description : "Labels for tooltips of the frame, from left to right active tooltips",
					$contentType : {
						$type : "json:String",
						$description : "Label for a tooltip"
					},
					$default : []
				},
				"hideIconNames" : {
					$type : "json:Array",
					$description : "Array of icon names which will not be displayed. This property is taken into account only when calling aria.widgets.frames.FrameWithIcons.createFrame.",
					$contentType : {
						$type : "json:String",
						$description : "Icon for widget"
					},
					$default : []
				},
				"iconsLeft" : {
					$type : "json:Array",
					$description : "Filled with the content of the skin properties by the aria.widgets.frames.FrameWithIcons.createFrame method.",
					$contentType : {
						$type : "json:String",
						$description : "Icon to be displayed left"
					},
					$default : []
				},
				"iconsRight" : {
					$type : "json:Array",
					$description : "Filled with the content of the skin properties by the aria.widgets.frames.FrameWithIcons.createFrame method.",
					$contentType : {
						$type : "json:String",
						$description : "Icon to be displayed right"
					},
					$default : []
				},
				"inlineBlock" : {
					$type : "json:Boolean",
					$description : "This frame needs to be inline-block."
				}
			}
		}
	}
});
