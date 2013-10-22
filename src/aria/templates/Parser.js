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
 * Template parser: builds a tree of type aria.templates.TreeBeans.Root from a template string.
 */
Aria.classDefinition({
    $classpath : "aria.templates.Parser",
    $dependencies : ["aria.utils.String"],
    $singleton : false,
    $constructor : function () {
        /**
         * Content of the template to be parsed.
         * @type String
         */
        this.template = null;

        /**
         * Map a character position from template to a line number.
         * @type Array
         * @private
         */
        this.__lineNumbers = null;

        /**
         * Index of the current line being parsed
         * @type Integer
         * @private
         */
        this.__currentLn = 0;

        /**
         * If true, parser will preserve whitespaces
         * @type Boolean
         */
        this._keepWhiteSpace = false;
    },
    $statics : {
        // ERROR MESSAGES:
        MISSING_CLOSINGBRACES : "line %1: Template parsing error: could not find corresponding '}'.",
        EXPECTING_OTHER_CLOSING_STATEMENT : "line %4: Template parsing error: found closing statement '%2', but '%1' (line %3) should be closed first.",
        INVALID_STATEMENT_NAME : "line %2: Template parsing error: invalid statement name: '%1'",
        STATEMENT_CLOSED_NOT_OPEN : "line %2: Template parsing error: could not find corresponding open statement for closing statement '%1'.",
        MISSING_CLOSING_STATEMENT : "line %2: Template parsing error: statement '%1' was open but never closed."
    },
    $prototype : {
        /**
         * Parse the given template and return a tree representing the template. This is an abstract method and is
         * implemented by the subclasses aria.templates.TplParser and aria.templates.CSSParser
         */
        parseTemplate : function (template, context, statements) {},

        /**
         * Transform the given template and set this.template and this.__lineNumbers for the given template
         * @param {String} template the template to transform After the execution of this method: this._template:
         * contains the modified template; modifications include removing comments, and spaces at the begining and end
         * of each line this.__lineNumbers: contains an array such that this.__lineNumbers[i] contains the position of
         * the \n character for the line #i
         * @protected
         */
        _prepare : function (template) {
            // normalize line breaks
            template = template.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            // remove commented lines containing CDATA
            template = template.replace(/\/\/.*\{(\/)?CDATA\}.*$/gm, "");

            var cdataSplit = template.split("{CDATA}"), parts = [], cdataParts;
            parts.push(cdataSplit[0]);
            for (var index = 1, l = cdataSplit.length; index < l; index++) {
                cdataParts = cdataSplit[index].split("{/CDATA}");
                if (cdataParts.length != 2) {
                    this.$logError(this.MISSING_CLOSING_STATEMENT, "CDATA", this.context);
                    this.template = template;
                    return;
                }
                parts = parts.concat(cdataParts);
            }

            // one on two is outside cdata -> remove comments and spaces
            for (var index2 = 0, l = parts.length, tplFragment, match; index2 < l; index2++) {
                tplFragment = parts[index2];
                if (index2 % 2 === 0) {

                    // Replace multi line comments with empty lines
                    var multiLineCommentRegEx = /\/\*(.|\n|\r)*?\*\//m;
                    while (match = tplFragment.match(multiLineCommentRegEx)) {
                        match = match + "";
                        var newLines = "";
                        var newLineIdx = -1;
                        while ((newLineIdx = match.indexOf("\n", newLineIdx + 1)) != -1) {
                            newLines += "\n";
                        }
                        tplFragment = tplFragment.replace(multiLineCommentRegEx, newLines);
                    }

                    // remove one line comments. First remove whole line comments...
                    tplFragment = tplFragment.replace(/^\/\/.*$/gm, "");
                    // ... then make sure they are not quoted and not directly preceded by colon
                    // to avoid misinterpretation of links.
                    // For quotes, do a positive lookahead to see that we have
                    // an even number of double quotes on the rest of the line
                    tplFragment = tplFragment.replace(/([\s\;\}\>\{\,\(])\/\/(?=(?:(?:[^"]*"){2})*[^"]*$).*$/gm, "$1");

                    if (!this._keepWhiteSpace) {
                        tplFragment = tplFragment.replace(/^[ \t]+/gm, ""); // remove spaces at the begining of each
                        // line
                        tplFragment = tplFragment.replace(/[ \t]+$/gm, ""); // remove spaces at the end of each line
                    }
                } else {
                    tplFragment = "{CDATA}" + tplFragment + "{/CDATA}";
                }
                parts[index2] = tplFragment;
            }

            template = parts.join('');
            this.template = template;
        },

        /**
         * Create an array with the indexes of all new line characters inside this.template, and store it in the object
         * so that it is possible to use positionToLineNumber after that.
         */
        _computeLineNumbers : function () {
            var template = this.template;
            this.__lineNumbers = [0];
            var index = template.indexOf('\n');
            while (index != -1) {
                this.__lineNumbers.push(index);
                index = template.indexOf('\n', index + 1);
            }
        },

        /**
         * Transform a character position in this.template into a line number.
         * @param {Integer} pos position in this.template
         * @return {Integer} The corresponding line number
         */
        positionToLineNumber : function (pos) {
            // Perf: assume always forward, double loop
            var lineNumbers = this.__lineNumbers, l = lineNumbers.length, i;
            for (i = this.__currentLn; i < l; i++) {
                if (pos < lineNumbers[i]) {
                    if (i > 0 && lineNumbers[i - 1] > pos) {
                        // previous assumption was wrong
                        break;
                    }
                    this.__currentLn = i;
                    return i;
                }
            }
            for (i = 0; i < this.__currentLn; i++) {
                if (pos < lineNumbers[i]) {
                    this.__currentLn = i;
                    return i;
                }
            }
            return this.__lineNumbers.length;
        },

        /**
         * Find closing braces following start in str, respecting nested blocks and escaped characters.
         * @param {String} str
         * @param {Integer} start
         * @return {Object} a structure containing the indexes of the next unescaped '}' and '{': { indexClose: index of
         * next closing brace or -1 if not enough closing braces were found to close all nested blocks and this block
         * indexOpen: index of the next opening brace following indexClose or -1 if no opening braces was found;
         * meaningless if indexClose == -1 } If indexClose != -1 && indexOpen != -1 then we always have: indexClose &lt;
         * indexOpen
         * @private
         */
        __findClosingBraces : function (str, start) {
            var cursorPos = start, nbrOfBlockOpened = 0, nextBlockBegin = -1, nextBlockEnd = -1;
            var utilString = aria.utils.String;
            do {
                if (nextBlockBegin < cursorPos) {
                    nextBlockBegin = utilString.indexOfNotEscaped(str, '{', cursorPos);
                }
                if (nextBlockEnd < cursorPos) {
                    nextBlockEnd = utilString.indexOfNotEscaped(str, '}', cursorPos);
                }
                if (nextBlockBegin > -1 && nextBlockBegin < nextBlockEnd) {
                    nbrOfBlockOpened++;
                    cursorPos = nextBlockBegin + 1;
                } else if (nextBlockEnd > -1) {
                    nbrOfBlockOpened--;
                    cursorPos = nextBlockEnd + 1;
                }
            } while (nbrOfBlockOpened >= 0 && nextBlockEnd > -1);
            // at this state, there is an error if nbrOfBlockOpened >= 0; but, as a consequence we also have
            // nextBlockEnd==-1,
            // (because we are out of the previous while condition)
            // Nothing special to do to report the error, as indexClose==-1 is the way this function returns errors
            this.$assert(163, nextBlockEnd == -1
                    || (nbrOfBlockOpened < 0 && (nextBlockEnd < nextBlockBegin || nextBlockBegin == -1)));
            return {
                indexClose : nextBlockEnd,
                indexOpen : nextBlockBegin
            };
        },

        /**
         * @param {String} tpl template
         * @param {Integer} start
         * @param {Integer} end
         * @return {String} tpl.substring(start,end) with escaped characters replaced by their value. Also remove new lines at
         * the begining and the end of the param
         * @private
         */
        __unescapeParam : function (tpl, start, end) {
            var res = tpl.substring(start, end);
            res = res.replace(/^[\r\n]+/, ''); // remove new lines at the begining and
            res = res.replace(/[\r\n]+$/, ''); // the end of the param
            // find each \ character followed by $ { } / \ * and suppress the first \ character
            res = res.replace(/\\([\/\{\}\$\\*])/g, "$1");
            return res;
        },

        /**
         * @param {String} tpl template
         * @param {Integer} start
         * @param {Integer} end
         * @return {String} tpl.substring(start,end) with escaped characters replaced by their value or "" if this string
         * contains only new lines
         * @private
         */
        __unescapeText : function (tpl, start, end) {
            var res = tpl.substring(start, end);
            if (/^[\r\n]*$/.test(res)) {
                return ""; // the text contains only new lines, remove it
            }
            // don't remove new lines
            // find each \ character followed by $ { } / \ * and suppress the first \ character
            res = res.replace(/\\([\/\{\}\$\\*])/g, "$1");
            return res;
        },

        /**
         * Log the given error.
         * @param {Integer} charIndex Position in this.template to locate the error. Will be transformed into a line
         * number and added at the end of otherParams
         * @param {String} msgId error id, used to find the error message
         * @param {Array} otherParams parameters of the error message
         * @private
         */
        __logError : function (charIndex, msgId, otherParams) {
            if (!otherParams) {
                otherParams = [];
            }
            otherParams.push(this.positionToLineNumber(charIndex));
            this.$logError(msgId, otherParams, this.context);
        },

        /**
         * Use this.template to build a tree At this step no external information is used (list of accepted
         * statements,...)
         * @return {Object} the tree built
         * @protected
         */
        _buildTree : function () {
            var utilString = aria.utils.String;
            this.__currentLn = 0;
            var tpl = this.template, begin = 0, // start of the current block
            end = 0, // end of the current block
            index = utilString.indexOfNotEscaped(tpl, '{'), // next index of { or }
            dollar = false, curStatement, curContainer = [], res = {
                name : "#ROOT#",
                paramBlock : "",
                parent : null,
                content : curContainer,
                lineNumber : 0
            }, stack = [res]; // stack of content containers
            while (index != -1) {
                dollar = (tpl.charAt(index - 1) == "$" && !utilString.isEscaped(tpl, index - 1));
                end = dollar ? index - 1 : index;
                if (end - begin > 0) {
                    curStatement = {
                        name : "#TEXT#",
                        parent : stack[stack.length - 1],
                        firstCharParamIndex : begin,
                        lastCharParamIndex : end,
                        paramBlock : this.__unescapeText(tpl, begin, end),
                        lineNumber : this.positionToLineNumber(begin)
                    };
                    if (curStatement.paramBlock.length > 0) {
                        curContainer.push(curStatement);
                    }
                }
                // read what is between { and }
                begin = index + 1;
                var info = this.__findClosingBraces(tpl, begin);
                end = info.indexClose;
                index = info.indexOpen;
                if (end == -1) {
                    this.__logError(begin, this.MISSING_CLOSINGBRACES);
                    return null;
                }
                if (dollar) {
                    curContainer.push({
                        name : "#EXPRESSION#",
                        parent : stack[stack.length - 1],
                        firstCharParamIndex : begin,
                        lastCharParamIndex : end,
                        paramBlock : this.__unescapeParam(tpl, begin, end),
                        lineNumber : this.positionToLineNumber(begin)
                    });
                    begin = end + 1;
                } else {
                    if (tpl.charAt(begin) == '/') {
                        // this is a closing statement
                        begin++;
                        // check that the lastly opened statement has the same name
                        curStatement = stack.pop();
                        var closingStatement = tpl.substring(begin, end);
                        if (stack.length === 0) { // the stack should always contain at least #ROOT#
                            this.__logError(begin, this.STATEMENT_CLOSED_NOT_OPEN, [closingStatement]);
                            return null;
                        } else if (curStatement.name != closingStatement) {
                            // look into the stack to see if there was a corresponding open statement
                            // to give the appropriate error message
                            for (var i = stack.length - 1; i >= 1; i--) {
                                if (stack[i].name == closingStatement) {
                                    this.__logError(begin, this.EXPECTING_OTHER_CLOSING_STATEMENT, [curStatement.name,
                                            closingStatement, curStatement.lineNumber]);
                                    return null;
                                }
                            }
                            this.__logError(begin, this.STATEMENT_CLOSED_NOT_OPEN, [closingStatement]);
                            return null;
                        }
                        curStatement.lastCharContentIndex = begin - 2; // end of the content just before the {
                        curContainer = stack[stack.length - 1].content; // return to the previous container from the
                        // stack
                        begin = end + 1;
                        closingStatement = null;
                    } else {
                        var nextBegin = end + 1, singleStatement = tpl.charAt(end - 1) == '/'
                                && !utilString.isEscaped(tpl, end - 1), statementName, firstCharParamIndex;

                        // adjust end index for singleStatement (remove one char for the /)
                        if (singleStatement) {
                            end--;
                        }

                        curStatement = {
                            parent : stack[stack.length - 1],
                            lastCharParamIndex : end
                        };
                        curContainer.push(curStatement);

                        firstCharParamIndex = utilString.nextWhiteSpace(tpl, begin, end, /[\s\{]/);
                        if (firstCharParamIndex == -1) {
                            firstCharParamIndex = end; // empty parameter
                            statementName = tpl.substring(begin, end);
                        } else {
                            statementName = tpl.substring(begin, firstCharParamIndex);
                            if (tpl.charAt(firstCharParamIndex) != '{') {
                                firstCharParamIndex++;
                            }
                        }
                        curStatement.firstCharParamIndex = firstCharParamIndex;
                        curStatement.lineNumber = this.positionToLineNumber(firstCharParamIndex);

                        if (statementName != "CDATA") {

                            curStatement.name = statementName;

                            if (!singleStatement) {
                                // this is an opening statement
                                curStatement.content = [];
                                curStatement.firstCharContentIndex = nextBegin;
                                stack.push(curStatement);
                                curContainer = curStatement.content;
                            }

                            if (!/^[_\w@:]+$/.test(curStatement.name)) {
                                this.__logError(begin, this.INVALID_STATEMENT_NAME, [curStatement.name]);
                                return null;
                            }

                            curStatement.paramBlock = this.__unescapeParam(tpl, firstCharParamIndex, end);
                            begin = nextBegin;
                        } else {

                            curStatement.name = "#CDATA#";

                            var cdataEnd = tpl.indexOf("{/CDATA}");
                            if (cdataEnd != -1) {
                                curStatement.paramBlock = tpl.substring(end + 1, cdataEnd);
                                var info = this.__findClosingBraces(tpl, cdataEnd + 1);
                                begin = info.indexClose + 1;
                                index = info.indexOpen;
                            } else {
                                this.__logError(begin, this.MISSING_CLOSING_STATEMENT, ["CDATA"]);
                                return null;
                            }
                        }
                    }
                }
            }
            end = tpl.length;
            if (end - begin > 0) {
                curStatement = {
                    name : "#TEXT#",
                    parent : stack[stack.length - 1],
                    firstCharParamIndex : begin,
                    lastCharParamIndex : end,
                    paramBlock : this.__unescapeText(tpl, begin, end),
                    lineNumber : this.positionToLineNumber(begin)
                };
                if (curStatement.paramBlock.length > 0) {
                    curContainer.push(curStatement);
                }
            }
            if (stack.length > 1) {
                this.__logError(stack[stack.length - 1].firstCharContentIndex, this.MISSING_CLOSING_STATEMENT, [stack[stack.length
                        - 1].name]);
                return null;
            }

            // Empty some attributes that might take memory
            this.template = this.__lineNumbers = null;

            return res;
        }
    }
});
