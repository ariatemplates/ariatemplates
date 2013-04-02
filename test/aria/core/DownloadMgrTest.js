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
 * Test for the DownloadMgr class
 * @class test.aria.core.DownloadMgrTest
 */
Aria.classDefinition({
    $classpath : "test.aria.core.DownloadMgrTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Callback"],
    $prototype : {

        /**
         * Set up the environment
         */
        setUp : function () {
            var downloadMgr = aria.core.DownloadMgr;
            this.trueURLMap = downloadMgr._urlMap; // saving the URL Map
            this.trueRootMap = downloadMgr._rootMap; // saving the Root Map
        },

        /**
         * Restore environment
         */
        tearDown : function () {
            var downloadMgr = aria.core.DownloadMgr;
            downloadMgr._urlMap = this.trueURLMap; // restoring the URL Map
            downloadMgr._rootMap = this.trueRootMap; // restoring the URL Map
        },

        /**
         * Callback to test advanced url mapping
         * @protected
         * @param {Object} evt
         * @param {Object} args
         */
        _testCallback : function (logicalPath, args) {
            this.assertTrue(args.test === "OK", "Missing argument in Url Mapping callback");
            this.assertTrue(logicalPath.substr(0, 6) == "path6/");
            return "my/callback/path/";
        },

        /**
         * Check that the resolveURL method works properly, by setting a test urlMap and checking that the results what
         * we expect.
         */
        testResolveURL : function () {

            var downloadMgr = aria.core.DownloadMgr;
            var callback = new aria.utils.Callback({
                fn : this._testCallback,
                scope : this,
                args : {
                    test : "OK"
                }
            });

            var oSelf = this;

            downloadMgr._urlMap = {
                // test simple redirection
                'path1' : {
                    'file1' : 'package1.txt'
                },
                // test redirection with root mapping
                'path2' : {
                    'file2' : 'package2.txt'
                },
                // test ** redirection
                'path3' : {
                    'file3' : 'package4.txt',
                    'path4' : {
                        'file4' : 'package5.txt',
                        '**' : 'package6.txt'
                    },
                    '**' : 'package7.txt'
                },

                // test * and ** redirection
                'path5' : {
                    'file5' : 'package8.txt',
                    '*' : 'package9.txt',
                    '**' : 'package10.txt'
                },

                // test callback overriding (as in PTR 4716034)
                'path7' : {
                    '**' : callback
                }
            };

            // use update to test function and callback injection
            downloadMgr.updateUrlMap({

                'path6' : {
                    'file6' : function (logicalPath) {
                        oSelf.assertTrue(logicalPath == "path6/file6.js", "Missing logical path.");
                        return "my/custom/path/";
                    },

                    'file7' : callback
                },

                'path7' : {
                    '**' : callback
                }

            });

            downloadMgr._rootMap = {
                'path2bis' : {
                    '*' : "/myOtherRootPackage2/",
                    'path1' : "/myOtherRootPackage3/",
                    'path2' : {
                        'file1' : "/myOtherRootPackage4/"
                    }
                },
                'path2' : "/myOtherRootPackage/"
            };

            // use update to test function and callback injection
            downloadMgr.updateRootMap({
                'path6' : {
                    'file6' : function (logicalPath) {
                        oSelf.assertTrue(logicalPath == "path6/file6.js", "Missing logical path.");
                        return "my/custom/path/";
                    },
                    'file7' : callback,
                    '*' : function () {
                        return "/myPathForRoot6/";
                    }
                }
            });

            // test simple redirection

            // in the map
            this.assertTrue(downloadMgr.resolveURL('path1/file1.js') == Aria.rootFolderPath + 'package1.txt');
            // not in the map
            this.assertTrue(downloadMgr.resolveURL('path1/file2.js') == Aria.rootFolderPath + 'path1/file2.js');

            // test redirection with root mapping
            // in the map, with redirection
            this.assertTrue(downloadMgr.resolveURL('path2/file2.js') == '/myOtherRootPackage/package2.txt');
            // not in the map, with redirection
            this.assertTrue(downloadMgr.resolveURL('path2/file1.js') == '/myOtherRootPackage/path2/file1.js');

            // not in the map,with redirection
            this.assertTrue(downloadMgr.resolveURL('path2/path1/file1.js') == '/myOtherRootPackage/path2/path1/file1.js');
            this.assertTrue(downloadMgr.resolveURL('path2bis/path1/file1.js') == '/myOtherRootPackage3/path2bis/path1/file1.js');
            this.assertTrue(downloadMgr.resolveURL('path2bis/path1bis/file1.js') == '/myOtherRootPackage2/path2bis/path1bis/file1.js');
            this.assertTrue(downloadMgr.resolveURL('path2bis/path2/file1.js') == '/myOtherRootPackage4/path2bis/path2/file1.js');

            // test ** redirection
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path3/file3.js') == Aria.rootFolderPath + 'package4.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path3/path4/file4.js') == Aria.rootFolderPath + 'package5.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path3/path4/file5.js') == Aria.rootFolderPath + 'package6.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path3/path4/path5/file1.js') == Aria.rootFolderPath
                    + 'package6.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path3/file1.js') == Aria.rootFolderPath + 'package7.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path3/path1/file1.js') == Aria.rootFolderPath + 'package7.txt');

            // test * and ** redirection
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path5/file5.js') == Aria.rootFolderPath + 'package8.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path5/file6.js') == Aria.rootFolderPath + 'package9.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path5/path6/file6.js') == Aria.rootFolderPath + 'package10.txt');
            // in the map
            this.assertTrue(downloadMgr.resolveURL('path5/path6/path7/file6.js') == Aria.rootFolderPath
                    + 'package10.txt');

            // test callbacks in url mapping
            this.assertTrue(downloadMgr.resolveURL('path6/file6.js') === 'my/custom/path/my/custom/path/', "Callback function did not return the expected path");
            this.assertTrue(downloadMgr.resolveURL('path6/file7.js') === 'my/callback/path/my/callback/path/', "Callback instance did not return the expected path");
            this.assertTrue(downloadMgr.resolveURL('path6/file8.js') === '/myPathForRoot6/path6/file8.js', "* with callback function was not handled properly");

            callback.$dispose();
        },

        /**
         * Test this scenario:
         *
         * <pre>
         * // 1 - load logical classpath in a file with multipart content
         * // 2- load a logical classpath targeting the same multipart content, but without being contained inside
         * </pre>
         */
        testAsyncMultiPartMissingFile : function () {
            var downloadMgr = aria.core.DownloadMgr;
            downloadMgr.updateUrlMap({
                'testPath' : {
                    '*' : "test/aria/core/test/MultipartMissingFile.txt"
                }
            });
            downloadMgr.loadFile("testPath/File1.txt", {
                fn : this._onExistingFileCb,
                scope : this
            });
        },

        /**
         * First existing file callback : next call is for the non-existing one
         */
        _onExistingFileCb : function (evt) {
            try {
                this.assertFalse(evt.downloadFailed, "The file should be available");

                aria.core.DownloadMgr.loadFile("testPath/File2.txt", {
                    fn : this._onNotExistingFileCb,
                    scope : this
                });
            } catch (ex) {
                this.notifyTestEnd("testAsyncMultiPartMissingFile");
            }

        },

        /**
         * First existing file callback : call for the non existing one
         */
        _onNotExistingFileCb : function (evt) {
            try {
                this.assertTrue(evt.downloadFailed, "The file should be available");

                this.getPackages();
            } catch (ex) {}
            this.notifyTestEnd("testAsyncMultiPartMissingFile");
        },

        /**
         * Unit test for the getPackages
         */
        getPackages : function () {
            var downloadMgr = aria.core.DownloadMgr;
            var originalUrlMap = downloadMgr._urlMap;

            downloadMgr._urlMap = {
                item1 : {
                    item2 : {
                        subitem1 : "package1_md1.js",
                        subitem1_bis : "package1_md1.js",
                        subitem2 : "package_not_required_md5555555555.js"
                    }
                },
                item2 : "package2_md2.js"
            };

            var result = downloadMgr.getPackages(['/package1', '/package2']);
            this.assertTrue(result.length == 2, "Two items should be retrieve");
            this.assertEquals(result[0], "/package1_md1.js", "The first result should be '/package1_md1.js'");
            this.assertEquals(result[1], "/package2_md2.js", "The second result should be '/package2_md2.js'");

            downloadMgr._urlMap = originalUrlMap;
        }
    }
});