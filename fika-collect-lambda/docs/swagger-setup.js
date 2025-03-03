import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import express from 'express';

const app = express();
const swaggerDocument = YAML.load('./openapi.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('Swagger UI is available at http://localhost:3000/api-docs');
});
