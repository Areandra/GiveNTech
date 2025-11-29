import FacilityService from '#services/fasility_service'
import FacilityValidator from '#validators/facility'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'

const FacilityCreate = FacilityValidator.create
const FacilityUpdate = FacilityValidator.update

@ApiSecurity('BearerAuth')
@ApiResponse({ status: 404, description: 'Not Found' })
export default class FasilitiesController {
  @ApiOperation({ summary: 'List all Facility' })
  @ApiResponse({
    status: 200,

    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Facility' } },
      },
    },
  })
  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await FacilityService.listFacilities(page)

    ctx.response.ok({
      succses: true,
      message: 'Facilities succsesfuly optained',
      data,
    })
  }

  @ApiOperation({ summary: 'Facility' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/Facility' },
      },
    },
  })
  async show(ctx: HttpContext) {
    const id = await ctx.params.id
    const data = await FacilityService.getFacility(id)

    ctx.response.ok({
      succses: true,
      message: `Facility with id ${id} has found`,
      data,
    })
  }

  @ApiOperation({ summary: 'Create Facility' })
  @ApiBody({ type: () => FacilityCreate })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  succses: true,
  message: 'Facility Created',
}`,
    },
  })
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(FacilityCreate)
    await FacilityService.createFacility(body)

    ctx.response.ok({
      succses: true,
      message: 'Facility created',
    })
  }

  @ApiOperation({ summary: 'Update Facility' })
  @ApiBody({ type: () => FacilityUpdate })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  succses: true,
  message: 'Facility Update',
}`,
    },
  })
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(FacilityUpdate)
    await FacilityService.updateFacility(id, body)

    ctx.response.ok({
      succses: true,
      message: 'Facility updated',
    })
  }

  @ApiOperation({ summary: 'Destroy Facility' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  succses: true,
  message: 'Facility deleted',
}`,
    },
  })
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    await FacilityService.deleteFacility(id)

    ctx.response.ok({
      succses: true,
      message: 'Facility deleted',
    })
  }
}
