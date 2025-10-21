import Fasilitas from '#models/fasilita'
import { createFasilitasValidator } from '#validators/fasilita'
import type { HttpContext } from '@adonisjs/core/http'

export default class FasilitasController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    return Fasilitas.query().paginate(page)
  }

  async store({ request }: HttpContext) {
    const validData = await request.validateUsing(createFasilitasValidator)
    return Fasilitas.create(validData)
  }

  async delete({ params, response }: HttpContext) {
    const fasilitasId = params.id

    const fasilitas = await Fasilitas.findOrFail(fasilitasId)

    const deletedfasilitas = fasilitas

    fasilitas.delete()

    return response.ok({
      message: 'booking delete successfully',
      data: deletedfasilitas,
    })
  }

  async update({ request, params, response }: HttpContext) {
      const fasilitasId = params.id
  
      const fasilitas = await Fasilitas.findOrFail(fasilitasId)
  
      fasilitas.merge(request.only(['nama', 'status']))
      await fasilitas.save()
  
      return response.ok({
        message: 'booking updated successfully',
        data: fasilitas,
      })
    }

  async show({ params }: HttpContext) {
    return Fasilitas.findOrFail(params.id)
  }
}
