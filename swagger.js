const swaggerAutogen = require('swagger-autogen')();

// la doc : https://swagger-autogen.github.io/docs/getting-started/quick-start/

const outputFile = './swagger-output.yaml';
const endpointsFiles = ['./routes/userRoutes.js', './routes/postRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles)