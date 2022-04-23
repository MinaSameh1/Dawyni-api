import { Express } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../package.json'
import logger from './logger'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Docs for grad project',
      version
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/api/**/*.router.ts', './src/api/**/*.schema.ts']
}

const swaggerSpec = swaggerJSDoc(options)

function swaggerDocs(app: Express, port: number) {
  const Route = '/api/docs'

  // Swagger Page
  app.use(Route, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Docs in JSON format
  app.get(`${Route}.json`, (_, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  logger.info(`Docs are available at http://localhost:${port}${Route}`)
}

export default swaggerDocs
