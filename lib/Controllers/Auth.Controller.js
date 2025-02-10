"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var logger_1 = __importDefault(require("../logger"));
var Auth_service_1 = require("../Services/Auth.service");
var ENV_configs_1 = require("../Configs/ENV-configs/ENV.configs");
var JWT_SECRET = ENV_configs_1.configs.JWT_SECRET;
var REFRESH_TOKEN_SECRET = ENV_configs_1.configs.REFRESH_TOKEN_SECRET;
if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. ");
}
var handleError = function (error) {
    logger_1.default.error(error.message);
};
var service = new Auth_service_1.AuthService();
var AuthController = /** @class */ (function () {
    function AuthController() {
        var _this = this;
        this.isAuthenticated = function (call, callback) { return __awaiter(_this, void 0, void 0, function () {
            var _a, accessToken, role, token, response, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = call.request, accessToken = _a.accessToken, role = _a.role;
                        console.log("Token validating...", call.request);
                        token = accessToken || '';
                        return [4 /*yield*/, service.roleBasedAuth({ token: token, role: role })];
                    case 1:
                        response = _b.sent();
                        console.log(response);
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        console.log('we got error 1');
                        handleError(e_1); // Using handleError to log the error
                        callback(null, { success: false, message: "An Error occured ".concat(e_1) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    AuthController.prototype.HandleRefresh = function (call, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        refreshToken = call.request.refreshToken;
                        console.log(refreshToken, 'refresh token from controller');
                        return [4 /*yield*/, service.refreshToken(refreshToken)];
                    case 1:
                        response = _a.sent();
                        callback(null, response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
