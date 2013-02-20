/*
 * This is the main loader for js files
 */

(function () {
    // this file includes the framework scripts
    // arguments are taken from the script url
    var version = '1.1-SNAPSHOT';
    var skin = 'atdefskin';
    var ariaPath, skinPath;

    // window.parent = window if not an iframe, so it should work in every case:
    var href = window.parent.document.location.href;
    var isDev = href.indexOf("dev=true") != -1;
    var isDebug = href.indexOf("debug=true") != -1;

    var split = href.split("/");
    var baseUrl = "/" + split[3];
    var baseUrlForDev = baseUrl + (isDev ? '/dev' : '');

    var isAttester = navigator.userAgent.indexOf('PhantomJS') != -1;
    if (isAttester) {
        // baseUrl = baseUrl + "/.."; baseUrlForDev = baseUrlForDev + "/../src"; // for testing
        baseUrl = baseUrlForDev = "";
        skin = 'atskin';
        ariaPath = baseUrlForDev + '/aria/bootstrap.js';
        skinPath = baseUrlForDev + '/aria/css/' + skin + ".js";
    } else {
        ariaPath = baseUrlForDev + '/aria/aria-templates-' + version + '.js';
        skinPath = baseUrl + '/css/' + skin + '-' + version + ".js";
    }

    window.loader = {
        changeRootFolder : function () {
            // Need to wait for some special classes to be here, before to continue
            if (window.Aria && window.aria && window.aria.core && window.aria.core.DownloadMgr && aria.core.MultiLoader
                    && (!isDev || (aria.widgets && aria.widgets.AriaSkin))) {
                Aria.rootFolderPath = baseUrl + "/";
                aria.core.DownloadMgr.updateRootMap({
                    "aria" : {
                        "*" : baseUrlForDev + "/"
                    }
                });
                window.loader.loadSkin();
            } else {
                setTimeout(function () {
                    window.loader.changeRootFolder();
                }, 25);
            }
        },

        loadSkin : function () {
            Aria.load({
                classes : ["aria.utils.ScriptLoader", "aria.core.DownloadMgr", "aria.core.AppEnvironment"],
                oncomplete : function () {
                    aria.utils.ScriptLoader.load(skinPath, function () {
                        aria.core.AppEnvironment.setEnvironment({
                            contextualMenu : {
                                enabled : true
                            } // to get the right-click refresh menu
                        }, null, true);

                        // Find the classpath in the url
                        var tplRegExp = new RegExp("tpl=([^&]+)");

                        var tpl = tplRegExp.exec(location.href);
                        var data = window.parent.testData;
                        if (window.parent !== window) {
                            // Iframe case
                            window.testData = data;
                        }

                        if (tpl) {
                            // if there's some callback passed from the parent frame for execution
                            if (Aria.$window.parent.onBeforeTemplateLoadInIframe) {
                                Aria.$window.parent.onBeforeTemplateLoadInIframe(aria, Aria);
                            }

                            Aria.loadTemplate({
                                classpath : tpl[1],
                                div : "myDiv",
                                data : data,
                                provideContext : true
                            }, {
                                fn : function (res) {
                                    window.tplCtxt = res.tplCtxt;
                                    window.parent.iframeLoaded = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    if (version == '') {
        // error
        // alert('Aria Templates version number not found in loader.js script arguments\nPlease check');
        return;
    }

    document.write('<scr' + 'ipt type="text/javascript" src="' + ariaPath + '"></scr' + 'ipt>');

    window.loader.changeRootFolder();

}());
