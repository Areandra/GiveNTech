import { BaseCommand } from '@adonisjs/core/ace' 
import User from '#models/user'
import env from '#start/env'

export default class CreateSuperAdmin extends BaseCommand {
  public static commandName = 'make:superadmin'
  public static description = 'Create the default super admin user if not exists'

  public async run() {
    const email = env.get('SUPER_ADMIN_EMAIL')
    const password = env.get('SUPER_ADMIN_PASSWORD')

    if (!email || !password) {
      this.logger.error('Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env')
      this.error = true 
      return
    }

    const existing = await User.findBy('email', email)
    if (existing) {
      this.logger.info('Super admin already exists.')
      return
    }

    await User.create({
      email,
      password,
      role: 'super_admin',
    })

    this.logger.success(`Super admin created: ${email}`)
  }
}