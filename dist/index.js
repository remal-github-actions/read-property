/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 948:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(__nccwpck_require__(622));
let workspacePath = process.env['GITHUB_WORKSPACE'] || process.cwd();
workspacePath = path_1.default.resolve(workspacePath);
module.exports = workspacePath;


/***/ }),

/***/ 538:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(186));
const fs = __importStar(__nccwpck_require__(747));
const javaProps = __importStar(__nccwpck_require__(814));
const path_1 = __importDefault(__nccwpck_require__(622));
const workspacePath_1 = __importDefault(__nccwpck_require__(948));
async function run() {
    try {
        const file = core.getInput('file', { required: true });
        const failIfFileNotFound = core.getInput('failIfFileNotFound').toLowerCase() === 'true';
        const property = core.getInput('property', { required: true });
        const failIfPropertyNotFound = core.getInput('failIfFileNotFound').toLowerCase() === 'true';
        const defaultValue = core.getInput('defaultValue');
        const absoluteFile = path_1.default.resolve(workspacePath_1.default, file);
        if (!fs.existsSync(absoluteFile)) {
            if (failIfFileNotFound) {
                throw new Error(`Properties file can't be found: ${absoluteFile}`);
            }
            else {
                core.setOutput('result', defaultValue);
                return;
            }
        }
        const properties = await javaProps.parseFile(absoluteFile);
        const value = properties[property];
        if (value == null) {
            if (failIfPropertyNotFound) {
                throw new Error(`Property '${property}' can't be found in properties file: ${absoluteFile}`);
            }
            else {
                core.setOutput('result', defaultValue);
                return;
            }
        }
        core.setOutput('result', value);
    }
    catch (error) {
        core.setFailed(error);
    }
}
run();


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 63:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __nccwpck_require__(176);
function parse(str) {
    const result = {};
    const lr = new utils_1.LineReader(str);
    let line;
    while ((line = lr.readLine()) !== undefined) {
        let keyLen = 0;
        let valueStart = line.length;
        let hasSep = false;
        let backslash = false;
        const lineLen = line.length;
        let pos = 0;
        for (; pos < lineLen; pos++) {
            const c = line[pos];
            if ((c === '=' || c === ':') && !backslash) {
                valueStart = keyLen + 1;
                hasSep = true;
                break;
            }
            else if ((c === ' ' || c === '\t' || c === '\f') && !backslash) {
                valueStart = keyLen + 1;
                break;
            }
            if (c === '\\') {
                backslash = !backslash;
            }
            else {
                backslash = false;
            }
            keyLen++;
        }
        while (valueStart < lineLen) {
            const c = line[valueStart];
            if (c !== ' ' && c !== '\t' && c !== '\f') {
                if (!hasSep && (c === '=' || c === ':')) {
                    hasSep = true;
                }
                else {
                    break;
                }
            }
            valueStart++;
        }
        const key = utils_1.decodeLine(line.substring(0, keyLen));
        const value = utils_1.decodeLine(line.substring(valueStart));
        result[key] = value;
    }
    return result;
}
exports.parse = parse;
function stringify(props) {
    let str = '';
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const value = props[key];
            str += utils_1.encodeLine(key, true) + ': ' + utils_1.encodeLine(value) + '\n';
        }
    }
    return str;
}
exports.stringify = stringify;
exports.default = {
    parse,
    stringify,
};
//# sourceMappingURL=java-props.js.map

/***/ }),

/***/ 814:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __importDefault(__nccwpck_require__(747));
const java_props_1 = __nccwpck_require__(63);
__export(__nccwpck_require__(63));
function parseFile(path, encoding) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, { encoding: encoding || 'utf8', flag: 'r' }, (err, data) => {
            if (err) {
                return reject(err);
            }
            try {
                const res = java_props_1.parse(data);
                return resolve(res);
            }
            catch (err) {
                /* istanbul ignore next */
                return reject(err);
            }
        });
    });
}
exports.parseFile = parseFile;
exports.default = {
    parse: java_props_1.parse,
    parseFile,
    stringify: java_props_1.stringify,
};
//# sourceMappingURL=node-java-props.js.map

/***/ }),

/***/ 176:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const DECODE_PATTERN = /(?:\\u(.{0,4})|\\(.?))/g;
const UNICODE_PATTERN = /^[0-9a-fA-F]{4}$/;
const ENCODE_PATTERN = /(?:[\u0000-\u001F\\\u007F-\uFFFF])/g;
const ENCODE_KEY_PATTERN = /(?:[\u0000-\u0020!#:=\\\u007F-\uFFFF])/g; // ENCODE_PATTERN with separators + comments
function decodeLine(line) {
    return line.replace(DECODE_PATTERN, (_, unicode, char) => {
        if (unicode !== undefined) {
            if (!unicode.match(UNICODE_PATTERN)) {
                throw new Error('Malformed \\uxxxx encoding.');
            }
            const charVal = parseInt(unicode, 16);
            return String.fromCharCode(charVal);
        }
        else if (char === 't') {
            return '\t';
        }
        else if (char === 'r') {
            return '\r';
        }
        else if (char === 'n') {
            return '\n';
        }
        else if (char === 'f') {
            return '\f';
        }
        else {
            return char;
        }
    });
}
exports.decodeLine = decodeLine;
function encodeLine(line, isKey) {
    let str = line.replace(isKey ? ENCODE_KEY_PATTERN : ENCODE_PATTERN, (c) => {
        if (c === '\t') {
            return '\\t';
        }
        else if (c === '\r') {
            return '\\r';
        }
        else if (c === '\n') {
            return '\\n';
        }
        else if (c === '\f') {
            return '\\f';
        }
        else if (c >= ' ' && c <= '~') {
            return '\\' + c;
        }
        else {
            const code = c.charCodeAt(0);
            if (code < 16)
                return '\\u000' + code.toString(16).toUpperCase();
            if (code < 256)
                return '\\u00' + code.toString(16).toUpperCase();
            if (code < 4096)
                return '\\u0' + code.toString(16).toUpperCase();
            return '\\u' + code.toString(16).toUpperCase();
        }
    });
    if (!isKey) {
        const c = str.charAt(0);
        if (c === ' ' || c === '\t' || c === '\f') {
            str = '\\' + str;
        }
    }
    return str;
}
exports.encodeLine = encodeLine;
/**
 * @deprecated Use {@link #decodeLine}.
 */
exports.convertLine = decodeLine;
class LineReader {
    constructor(str) {
        this.pos = 0;
        this.str = str;
        this.strLen = str.length;
    }
    readLine() {
        let skipWhiteSpace = true;
        let commentLine = false;
        let newLine = true;
        let appendedLineBegin = false;
        let backslash = false;
        let skipLF = false;
        let line = '';
        while (this.pos < this.strLen) {
            const c = this.str[this.pos++];
            if (skipLF) {
                skipLF = false;
                if (c === '\n') {
                    continue;
                }
            }
            if (skipWhiteSpace) {
                if (c === ' ' || c === '\t' || c === '\f') {
                    continue;
                }
                if (!appendedLineBegin && (c === '\r' || c === '\n')) {
                    continue;
                }
                skipWhiteSpace = false;
                appendedLineBegin = false;
            }
            if (newLine) {
                newLine = false;
                if (c === '#' || c === '!') {
                    commentLine = true;
                    continue;
                }
            }
            if (c !== '\n' && c !== '\r') {
                line += c;
                if (c === '\\') {
                    backslash = !backslash;
                }
                else {
                    backslash = false;
                }
            }
            else {
                // reached EOL
                if (commentLine || line === '') {
                    commentLine = false;
                    newLine = true;
                    skipWhiteSpace = true;
                    line = '';
                    continue;
                }
                if (backslash) {
                    line = line.substring(0, line.length - 1);
                    skipWhiteSpace = true;
                    appendedLineBegin = true;
                    backslash = false;
                    if (c === '\r') {
                        skipLF = true;
                    }
                }
                else {
                    return line;
                }
            }
        }
        if (backslash) {
            line = line.substring(0, line.length - 1);
        }
        if (line === '' || commentLine) {
            return undefined;
        }
        return line;
    }
}
exports.LineReader = LineReader;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(538);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;