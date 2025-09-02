
import * as grpc from "@grpc/grpc-js";
import path from "path";
import * as protoLoader from "@grpc/proto-loader";
import { AuthController } from '../Controllers/Auth.Controller';
import { configs } from '../Configs/ENV-configs/ENV.configs';





const packatgeDefinition = protoLoader.loadSync(
    path.join(__dirname, "/Protos/auth.proto"),
    { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
)


const authProto = grpc.loadPackageDefinition(packatgeDefinition) as any;
const server = new grpc.Server()
export const controller = new AuthController()
const port = configs.AUTH_GRPC_PORT
const grpcServerStart = () => {
    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.log(err, "Error happened grpc auth service.");
                return;
            } else {
                console.log("AUTH_SERVICE running on port", port);
            }
        }
    )
}

server.addService(authProto.AuthService.service, {
    IsAuthenticated: controller.isAuthenticated,
    RefreshToken: controller.HandleRefresh,
})



export default grpcServerStart
