import {app} from './app'

const args: string[] | undefined = process.argv.slice(1)

/**
 * There are issues loading environment variables when running
 * via node or ts-node. It is recommended to run locally with
 * serverless-offline instead.
 */
function run() {
  if (args && args[0] == 'ts') {
    app.initServer('ts')
  }

  app.run()
}

run()
