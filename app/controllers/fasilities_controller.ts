import FacilityService from '#services/fasility_service'
import web_socket_service from '#services/web_socket_service'
import FacilityValidator from '#validators/facility'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'
import { ApiErrorResponses } from '#validators/global_error'

const FacilityCreate = FacilityValidator.create
const FacilityUpdate = FacilityValidator.update

@ApiSecurity('BearerAuth')
@ApiErrorResponses.Forbidden
@ApiErrorResponses.Unauthorized
export default class FasilitiesController {
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Daftar Semua Fasilitas' })
  @ApiResponse({
    status: 200,
    description: 'Daftar fasilitas berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Daftar fasilitas berhasil diperoleh' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Facility' } },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const data = await FacilityService.listFacilities(page)

    return this.ok(ctx, 'Daftar fasilitas berhasil diperoleh', { data })
  }

  @ApiOperation({ summary: 'Ambil Fasilitas berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Fasilitas berhasil ditemukan',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Fasilitas dengan ID 1 berhasil ditemukan' },
        data: { $ref: '#/components/schemas/Facility' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await FacilityService.getFacility(id)

    return this.ok(ctx, `Fasilitas dengan ID ${id} berhasil ditemukan`, { data })
  }

  @ApiOperation({ summary: 'Buat Fasilitas Baru' })
  @ApiBody({ type: () => FacilityCreate })
  @ApiResponse({
    status: 200,
    description: 'Fasilitas berhasil dibuat',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Fasilitas berhasil dibuat' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(FacilityCreate)
    await FacilityService.createFacility(body)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Fasilitas berhasil dibuat')
  }

  @ApiOperation({ summary: 'Perbarui Fasilitas' })
  @ApiBody({ type: () => FacilityUpdate })
  @ApiResponse({
    status: 200,
    description: 'Fasilitas berhasil diperbarui',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Fasilitas berhasil diperbarui' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(FacilityUpdate)
    await FacilityService.updateFacility(id, body)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Fasilitas berhasil diperbarui')
  }

  @ApiOperation({ summary: 'Hapus Fasilitas' })
  @ApiResponse({
    status: 200,
    description: 'Fasilitas berhasil dihapus',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Fasilitas berhasil dihapus' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    await FacilityService.deleteFacility(id)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Fasilitas berhasil dihapus')
  }
}
