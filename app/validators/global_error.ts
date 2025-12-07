import { ApiResponse } from '@foadonis/openapi/decorators'

export const ApiErrorResponses = {
  Unauthorized: ApiResponse({
    status: 401,
    description: 'Tidak terautentikasi',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 401 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tidak Terautentikasi (Unauthorized).' },
      },
    },
  }),
  Forbidden: ApiResponse({
    status: 403,
    description: 'Akses ditolak',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 403 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Dilarang Mengakses (Forbidden).' },
      },
    },
  }),
  NotFound: ApiResponse({
    status: 404,
    description: 'Sumber daya tidak ditemukan',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 404 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Endpoint atau Sumber Daya Tidak Ditemukan.' },
      },
    },
  }),
  ValidationError: ApiResponse({
    status: 422,
    description: 'Kesalahan Validasi Input',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 422 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Kesalahan Validasi. Periksa input Anda.' },
        errors: { type: 'object', example: { email: ['Email wajib diisi.'] } },
      },
    },
  }),
  InternalServerError: ApiResponse({
    status: 500,
    description: 'Kesalahan Server Internal',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 500 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Terjadi Kesalahan Server Internal.' },
      },
    },
  }),
  InvalidCredential: ApiResponse({
    status: 400,
    description: 'Invalid user credentials',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 400 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid user credentials.' },
      },
    },
  }),
}
