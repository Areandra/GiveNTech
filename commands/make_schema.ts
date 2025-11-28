import { args, BaseCommand } from '@adonisjs/core/ace'
import { join } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'

export default class MakeSchema extends BaseCommand {
  public static commandName = 'make:schema'
  public static description = 'Generate new schema file'

  @args.string({ description: 'name' })
  declare name: string

  public async run() {
    const tempName = this.name
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')

    const fileName = `${tempName.toLowerCase()}_schema.ts`
    const template = `export class ${this.name.replace(/^./, (c) => c.toUpperCase())} {
    }
`

    const outputPath = join('app', 'schemas', fileName)
    mkdirSync(join('app', 'schemas'), { recursive: true })
    writeFileSync(outputPath, template)

    console.log(`DONE:    create schemas/${fileName}`)
  }
}
