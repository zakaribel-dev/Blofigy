const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.yaml';
const endpointsFiles = ['./routes/userRoutes.js', './routes/postRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles)