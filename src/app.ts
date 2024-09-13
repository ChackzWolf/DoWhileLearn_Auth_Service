import express from 'express';
import morgan from 'morgan';
import logger from './logger';
import * as grpc from "@grpc/grpc-js";
import path from "path";
import * as protoLoader from "@grpc/proto-loader";
import { AuthController } from './Controllers/Auth.Controller';

const app = express();

// Use Morgan for logging HTTP requests
app.use(morgan('combined')); // 'combined' is a predefined format

// Your routes go here
// Example: app.use('/api/users', userRoutes);

// Error handling middleware
const errorHandler = (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error(err.stack || err.message);
    res.status(500).send('Something broke!');
};

app.use(errorHandler);


const packatgeDefinition = protoLoader.loadSync(
    path.join(__dirname, "/protos/auth.proto"), 
    {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true}
) 


const authProto = grpc.loadPackageDefinition(packatgeDefinition)as any;

const server =  new grpc.Server()
export const controller = new AuthController()


const grpcServer = () => {
    server.bindAsync(
        `0.0.0.0:${process.env.AUTH_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err,port) => {
            if(err){
                console.log(err, "Error happened grpc user service.");
                return;
            }else{
                console.log("gRPC user server started on port", port);
            }
        } 
    )
}

server.addService(authProto.AuthService.service, {
    IsAuthenticated: controller.isAuthenticated,
    RefreshToken: controller.HandleRefresh,
})



export default grpcServer