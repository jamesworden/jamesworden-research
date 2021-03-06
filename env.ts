/**
 * Used by node script => env:<ENV_NAME>
 * This sets the environment for running tests.
 */

type fileConfig = {
  name: string
  dir: string
}

/**
 * Node script argument
 */
const args: string[] | undefined = process.argv.slice(1)

function setEnv() {
  if (!args) {
    console.error('Please provide an environment.')
    return
  }

  const environment: string = args[1]

  if (!environment) {
    console.error(`No environment specified.`)
    return
  }

  const fs = require('fs')

  const fileConfigs: fileConfig[] = [
    {
      name: 'cypress.env.json',
      dir: './test/ui/'
    }
  ]

  fileConfigs.forEach((config) => {
    const input: string = `./${environment}.env.json`
    const output: string = `${config.dir}${config.name}`

    fs.copyFile(input, output, (err: Error) => {
      if (err) {
        throw err
      }
    })
  })

  console.log(`${environment} environment was set.`)
}

setEnv()
