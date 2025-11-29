import { BaseCommand, args } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'

export default class AdminCommand extends BaseCommand {
  static commandName = 'app:admin'
  static description = 'Admin Management: create, promote, password-reset, or list.'

  @args.string({
    argumentName: 'action',
    description: 'Action: create, promote, password-reset, or list.',
  })
  declare action: string

  @args.string({
    description: 'User ID or Email (required for promote/password-reset)',
    required: false,
  })
  declare identifier?: string

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    switch (this.action) {
      case 'create':
        await this.createUser()
        break
      case 'promote':
        if (this.identifier) await this.promoteUser(this.identifier)
        else
          this.logger.error('The user ID or Email identifier is required for the promote action.')
        break
      case 'password-reset':
        if (this.identifier) await this.resetPassword(this.identifier)
        else
          this.logger.error(
            'The user ID or Email identifier is required for the password-reset action.'
          )
        break
      case 'list':
        await this.listUsers()
        break
      case 'destroy':
        if (this.identifier) await this.destroyUser(this.identifier)
        else
          this.logger.error(
            'The user ID or Email identifier is required for the password-reset action.'
          )
        break
      default:
        this.logger.error(
          `Unknown action: ${this.action}. Use create, promote, password-reset, or list.`
        )
    }
  }

  private async createUser() {
    this.logger.info('Create New Admin')

    const username = await this.prompt.ask('Username', {
      validate(value) {
        if (value.length < 3 || value.length > 50) {
          // Corrected validation logic
          return 'Username must be between 3 and 50 characters.'
        }
        return true
      },
    })

    const email = await this.prompt.ask('Email', {
      validate(value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email format is invalid.'
        }
        return true
      },
    })

    const password = await this.prompt.secure('Password', {
      validate(value) {
        if (value.length < 6) {
          // Consistent with prompt message
          return 'Password must contain at least 6 characters.'
        }
        return true
      },
    })

    const confirmed = await this.prompt.confirm(`Confirm creating admin with email: ${email}?`)

    if (!confirmed) {
      this.logger.info('Cancelled.')
      return
    }

    try {
      const user = await User.create({
        username,
        email,
        password,
        role: 'admin',
      })

      this.logger.success(
        `Admin created successfully: ${user.email}, continue to login to get acsess_token`
      )
    } catch (error) {
      this.logger.error('Failed to create admin.')
      this.logger.error(error.message)
    }
  }

  private async findUserByIdentifier(identifier: string) {
    if (!Number.isNaN(Number(identifier))) {
      return User.find(identifier)
    }
    return User.findBy('email', identifier)
  }

  private async promoteUser(identifier: string) {
    try {
      const user = await this.findUserByIdentifier(identifier)

      if (!user) {
        this.logger.error(`Cannot find User with ID/Email '${identifier}'.`)
        return
      }

      if (user.role === 'admin') {
        this.logger.warning(`User ${user.email} is already an Admin.`)
        return
      }

      user.role = 'admin'
      await user.save()
      this.logger.success(`User ${user.email} successfully promoted to Admin.`)
    } catch (error) {
      this.logger.error('Failed to promote user.')
      this.logger.error(error.message)
    }
  }

  private async resetPassword(identifier: string) {
    try {
      const user = await this.findUserByIdentifier(identifier)

      if (!user) {
        this.logger.error(`Cannot find User with ID/Email '${identifier}'.`)
        return
      }

      const newPassword = await this.prompt.secure('New Password: ', {
        validate: (v) => (v.length >= 6 ? true : 'Password must contain at least 6 characters.'),
      })

      user.password = newPassword
      await user.save()
      this.logger.success(`Password for user ${user.username} successfully reset.`)
    } catch (error) {
      this.logger.error('Failed to reset password.')
      this.logger.error(error.message)
    }
  }

  private async listUsers() {
    try {
      const users = await User.query().where('role', 'admin').orderBy('id', 'asc')

      if (users.length === 0) {
        this.logger.info('No admin users found.')
        return
      }

      const tableData = users.map((user) => ({
        'ID': user.id,
        'Username': user.username,
        'Email': user.email,
        'Created At': user.createdAt.toISODate(),
      }))

      console.table(tableData)
    } catch (error) {
      this.logger.error('Cannot list user data.')
      this.logger.error(error.message)
    }
  }

  private async destroyUser(identifier: string) {
    try {
      const user = await this.findUserByIdentifier(identifier)
      const userName = user?.username
      if (!user) {
        this.logger.error(`Cannot find User with ID/Email '${identifier}'.`)
        return
      }

      user.delete()
      this.logger.success(`User ${userName} successfully reset.`)
    } catch (error) {
      this.logger.error('Failed to reset password.')
      this.logger.error(error.message)
    }
  }
}
