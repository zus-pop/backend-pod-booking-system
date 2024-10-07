import swaggerUI from "swagger-ui-express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "PODDY API Documentation",
            version: "1.0.0",
            description: "API for POD booking system",
        },
        servers: [
            {
                url: process.env.SWAGGER_SERVER as string,
            },
        ],
        components: {
            securitySchemes: {
                Authorization: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    value: "Bearer <JWT token here>",
                },
            },
        },
    },
    apis: ["./src/app/v1/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(options);

export { swaggerUI, swaggerSpec };
