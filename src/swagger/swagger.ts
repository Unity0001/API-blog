import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ket Blog API",
      version: "1.0.0",
      description: "Documentation for the Ket Blog API",
    },
    servers: [
      {
        url: "http://localhost:3200",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJSDoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar {
      display: none;
    }
    
    .swagger-ui .information-container {
      margin-top: 10px;
    }
    
    .swagger-ui .info h2 {
      color: #3182ce;
      font-size: 24px;
    }
  `,
  customSiteTitle: "Ket Blog API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: "none",
    filter: true,
  },
};

export { swaggerUi, specs, swaggerOptions };
