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
                url: "http://3.27.69.109:3000",
            },
            {
                url: "http://localhost:3000",
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
    apis: ["./src/v1/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(options);

export { swaggerUI, swaggerSpec };
