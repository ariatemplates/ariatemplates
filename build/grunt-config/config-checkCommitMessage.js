/*
 * Copyright 2014 Amadeus s.a.s.
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
 * Commit message checking grunt configuration.
 * @param {Object} grunt
 */
module.exports = function (grunt) {

    // https://help.github.com/articles/closing-issues-via-commit-messages
    var githubCloseIssueRegex = /(((close|resolve)(s|d)?)|fix(e(s|d))?) #\d+/i;

    // the commit is either a fix, a feature, a documentation fix, a refactoring, new release commit, or
    // Work-In-Progress temporary commit
    var msgStartRegex = /^((refactor|doc) |((fix|feat) #\d+ )|(v?\d+\.\d+\.\d+)|WIP)/;

    grunt.config.set('grunt-commit-message-verify', {
        minLength : 0,
        maxLength : 3000,
        minFirstLineLength : 20, // first line should be both concise and informative
        maxFirstLineLength : 0,  // use global below
        maxLineLength : 80,      // this is to prevent overflows in console and Github UI
        regexes : {
            "check start of the commit" : {
                regex : msgStartRegex,
                explanation : "The commit should start with sth like fix #123, feat #123, doc, refactor, or WIP for test commits"
            },
            "is github compliant" : {
                regex : githubCloseIssueRegex,
                explanation : "The commit should contain sth like fix #123 or close #123 somewhere"
            }
        }
    });
};
