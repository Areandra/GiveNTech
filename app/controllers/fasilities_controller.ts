import FacilityService from '#services/fasility_service'
import FacilityValidator from '#validators/facility'
import type { HttpContext } from '@adonisjs/core/http'

export default class FasilitiesController {
  service = new FacilityService()
  validator = new FacilityValidator()

  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await this.service.listFacilities(page)

    ctx.response.ok({
      succses: true,
      message: 'Facilities succsesfuly optained',
      data,
    })
  }

  async show(ctx: HttpContext) {
    const id = await ctx.params.id
    const data = await this.service.getFacility(id)

    ctx.response.ok({
      succses: true,
      message: `Facility with id ${id} has found`,
      data,
    })
  }

  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(this.validator.create)
    await this.service.createFacility(body)

    ctx.response.ok({
      succses: true,
      message: 'Facility created',
    })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(this.validator.create)
    await this.service.updateFacility(id, body)

    ctx.response.ok({
      succses: true,
      message: 'Facility updated',
    })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    await this.service.deleteFacility(id)

    ctx.response.ok({
      succses: true,
      message: 'Facility deleted',
    })
  }
}
