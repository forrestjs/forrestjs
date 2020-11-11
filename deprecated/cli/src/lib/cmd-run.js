import path from 'path'
import fs from 'fs-extra'

import cmdNew from './cmd-new'
import { hasYarn, spawn } from './utils'

export default async (argv) => {
    const projectCwd = argv._[1]
        ? path.join(process.cwd(), argv._[1])
        : process.cwd()

    // ensure package.json exists in cwd
    // this is if the CLI is invoked without a project name:
    // $> forrest run 
    const packagePath = path.join(projectCwd, 'package.json')
    if (!argv._[1] && !fs.existsSync(packagePath)) {
        throw new Error('package.json not found\n          is this a Forrest project?')
    }

    // optionally create the project
    if (!fs.existsSync(projectCwd)) {
        try {
            await cmdNew(argv)
        } catch (err) {
            throw err
        }
    }

    // ensure package.json exists in cwd
    // this works for both a named project or inside a project folder
    if (!fs.existsSync(packagePath)) {
        throw new Error('package.json not found\n          is this a Forrest project?')
    }

    // create a custom environment to run the app
    const env = { ...process.env }
    if (argv.port) {
        env.REACT_APP_PORT = argv.port
    }

    // run production or development (default)
    if (argv.d) {
        const cmd = await hasYarn()
            ? 'yarn start'
            : 'npm run start'

        spawn(cmd, {
            log: console.log,
            cwd: projectCwd,
            env,
        })
    } else {
        const cmd = await hasYarn()
            ? 'yarn start'
            : 'npm run start'

        spawn(cmd, {
            log: console.log,
            cwd: projectCwd,
            env,
        })
    }
}