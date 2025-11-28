import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import YAML from 'yaml'

export default class OpenAPIsController {
  async html({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const url = router.makeUrl('/docs.json')
    const content = openapi.generateUi(url)
    return response.status(200).header('Content-Type', 'text/html').send(content)
  }
  async json({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const document = await openapi.buildDocument()
    const body = JSON.stringify(document)
    return response.status(200).header('Content-Type', 'application/json').send(body)
  }
  async yaml({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const document = await openapi.buildDocument()
    const body = YAML.stringify(document)
    return response.status(200).header('Content-Type', 'application/yaml').send(body)
  }
}
