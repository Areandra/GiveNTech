import { args, BaseCommand } from '@adonisjs/core/ace'
import { join } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'

export default class MakeRule extends BaseCommand {
  public static commandName = 'make:rule'
  public static description = 'Generate new schema rules file'

  @args.string({ description: 'name' })
  declare name: string

  public async run() {
    const fileName = `${this.name
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/([A-Z])(?=[a-z])/g, '_$1')
      .toLowerCase()}_rules.ts`

    const template = `import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type options = {
    bool: bool
}

async function ${this.name}(value: unknown, options: options, field: FieldContext) {
}

const ${this.name}Rule = vine.createRule(${this.name})
export default ${this.name}Rule
`

    const outputPath = join('app', 'rules', fileName)
    mkdirSync(join('app', 'rules'), { recursive: true })
    writeFileSync(outputPath, template)

    console.log(`DONE:    create rules/${fileName}`)
  }
}
