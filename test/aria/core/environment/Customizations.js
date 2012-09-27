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
	$classpath : "test.aria.core.environment.Customizations",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["aria.core.environment.Customizations"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
    testAsyncDescriptorLoaded : function () {
      // Customization descriptor does not exist
      aria.core.environment.Customizations.$onOnce({
        "descriptorLoaded" : {fn : this._loadErrorFile, scope : this}});
      aria.core.environment.Customizations.setCustomizations(Aria.rootFolderPath + "ExternalCustomizationsFile.json");

      // Customization descriptor ok
      aria.core.environment.Customizations.$onOnce({
        "descriptorLoaded" : {fn : this._afterExternalCustomFile, scope : this}});
      aria.core.environment.Customizations.setCustomizations(Aria.rootFolderPath + "test/aria/core/test/ExternalCustomizationsFile.json");
    },

    _loadErrorFile : function () {
      this.assertTrue(aria.core.environment.Customizations.descriptorLoaded());
      this.assertErrorInLogs(aria.core.environment.Customizations.DESCRIPTOR_NOT_LOADED);
      aria.core.environment.Customizations.setCustomizations({}); // remove any customization
    },

    _afterExternalCustomFile : function () {
      this.assertTrue(aria.core.environment.Customizations.descriptorLoaded());
      aria.core.environment.Customizations.setCustomizations({}); // remove any customization
      this.notifyTestEnd('testAsyncDescriptorLoaded');
    },

    testGetCustomModules : function () {
      var tmp = aria.core.environment.Customizations.getCustomModules("old.Module.MyModuleFlow");

      aria.core.environment.Customizations.setCustomizations({
        modules : {
          "old.Module.MyModuleFlow" : ["new.Flow.AnyClassPath"]
        }
      });
      var newFlow = aria.core.environment.Customizations.getCustomModules("old.Module.MyModuleFlow");
      this.assertTrue(newFlow == "new.Flow.AnyClassPath");
      aria.core.environment.Customizations.setCustomizations({});
    },

		testGetFlowCP : function () {
			aria.core.environment.Customizations.setEnvironment({
				customization : {
					descriptor : {
						flows : {
							"old.Module.MyModuleFlow" : "new.Flow.AnyClassPath"
						}
					}
				}
			});
			var newFlow = aria.core.environment.Customizations.getFlowCP("old.Module.MyModuleFlow");
			this.assertTrue(newFlow == "new.Flow.AnyClassPath");
			aria.core.environment.Customizations.setCustomizations({});
		},

    testGetTemplateCP : function () {
      aria.core.environment.Customizations.setEnvironment({
        customization : {
          descriptor : {
            templates : {
              "old.Module.MyModuleFlow" : "new.Flow.AnyClassPath"
            }
          }
        }
      });
      var newFlow = aria.core.environment.Customizations.getTemplateCP("old.Module.MyModuleFlow");
      this.assertTrue(newFlow == "new.Flow.AnyClassPath");
      aria.core.environment.Customizations.setCustomizations({});
    },

    testGetCustomizations : function () {
      aria.core.environment.Customizations.setCustomizations({
        flows : {
          "a.b.c" : "d.e.f"
        }
      });

      var tmp = {"a.b.c" : "d.e.f"};
      var cstmz = aria.core.environment.Customizations.getCustomizations();
      this.assertTrue(aria.utils.Json.equals(cstmz.flows, tmp));
      aria.core.environment.Customizations.setCustomizations({});
    },

    testSetCustomizations : function () {
      aria.core.environment.Customizations.setEnvironment({
        customization : {
          descriptor : {
            flows : {
              "old.Module.MyModuleFlow" : "old.Flow.AnyClassPath"
            }
          }
        }
      });
      var oldFlow = aria.core.environment.Customizations.getFlowCP("old.Module.MyModuleFlow");
      this.assertTrue(oldFlow == "old.Flow.AnyClassPath");

      aria.core.environment.Customizations.setCustomizations({
        flows : {
          "old.Module.MyModuleFlow" : "new.Flow.AnyClassPath"
        }
      });

      var newFlow = aria.core.environment.Customizations.getFlowCP("old.Module.MyModuleFlow");
      this.assertTrue(newFlow == "new.Flow.AnyClassPath");
      aria.core.environment.Customizations.setCustomizations({});
    },

    testIsCustomized : function () {
      aria.core.environment.Customizations.setCustomizations({
        flows : {
          "old.Module.MyModuleFlow" : "new.Flow.AnyClassPath"
        }
      });
      this.assertTrue(aria.core.environment.Customizations.isCustomized());
      aria.core.environment.Customizations.setCustomizations({});
    },

    testAsyncInvalidCustomizationDescriptor : function () {
      // Customization descriptor in invalid format
      aria.core.environment.Customizations.$onOnce({
        "descriptorLoaded" : {fn : this._loadInvalidFile, scope : this}});
      aria.core.environment.Customizations.setCustomizations(Aria.rootFolderPath + "test/aria/core/test/WrongExternalCustomizationsFile.json");
    },

    _loadInvalidFile : function () {
      this.assertErrorInLogs(aria.utils.Json.INVALID_JSON_CONTENT);
      this.assertErrorInLogs(aria.core.environment.Customizations.INVALID_DESCRIPTOR);
      aria.core.environment.Customizations.setCustomizations({}); // remove any customization
      this.notifyTestEnd('testAsyncInvalidCustomizationDescriptor');
    }
	}
});