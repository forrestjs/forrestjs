import yargs from 'yargs'
import cmdNew from './cmd-new'
import cmdRun from './cmd-run'

export const create = () =>
    yargs
        .usage('Usage: $0 <command> [options]')
        .command({
            command: 'new',
            desc: 'Create a new project based on a starter',
            builder: (yargs) => (
                yargs
                    .alias('t', 'template')
                    .alias('p', 'port')
                    .default('template', 'forrestjs/starter-universal')
                    .demandCommand(1, 'please pass down the project name')
            ),
            handler: cmdNew
        })
        .command({
            command: 'run',
            desc: 'Runs a local project or creates it based on a starter',
            builder: (yargs) => (
                yargs
                    .alias('t', 'template')
                    .alias('p', 'port')
                    .default('template', 'forrestjs/starter-universal')
            ),
            handler: cmdRun
        })
        .demandCommand(1, `Pass --help to see all available commands and options.`)
        .fail((msg, err, yargs) => {
            const message = msg || err.message
            console.error(`[forrest] ${message}`)
        })
        .argv
