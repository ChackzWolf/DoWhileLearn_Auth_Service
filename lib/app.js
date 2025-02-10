"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var logger_1 = __importDefault(require("./logger"));
var grpc = __importStar(require("@grpc/grpc-js"));
var path_1 = __importDefault(require("path"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var Auth_Controller_1 = require("./Controllers/Auth.Controller");
var ENV_configs_1 = require("./Configs/ENV-configs/ENV.configs");
var app = (0, express_1.default)();
// Use Morgan for logging HTTP requests
app.use((0, morgan_1.default)('combined')); // 'combined' is a predefined format
// Your routes go here
// Example: app.use('/api/users', userRoutes);
// Error handling middleware
var errorHandler = function (err, _req, res, _next) {
    logger_1.default.error(err.stack || err.message);
    res.status(500).send('Something broke!');
};
app.use(errorHandler);
var packatgeDefinition = protoLoader.loadSync(path_1.default.join(__dirname, "/Protos/auth.proto"), { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
var authProto = grpc.loadPackageDefinition(packatgeDefinition);
var server = new grpc.Server();
exports.controller = new Auth_Controller_1.AuthController();
var port = ENV_configs_1.configs.AUTH_GRPC_PORT;
var grpcServer = function () {
    server.bindAsync("0.0.0.0:".concat(port), grpc.ServerCredentials.createInsecure(), function (err, port) {
        if (err) {
            console.log(err, "Error happened grpc auth service.");
            return;
        }
        else {
            console.log("AUTH_SERVICE running on port", port);
        }
    });
};
server.addService(authProto.AuthService.service, {
    IsAuthenticated: exports.controller.isAuthenticated,
    RefreshToken: exports.controller.HandleRefresh,
});
exports.default = grpcServer;
