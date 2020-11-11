/**
 * Clones a new project from a starter:
 * - cloning it from GitHub as default behaviour
 * - or downloading a ZIP from any url
 */

import path from 'path'
import fs from 'fs-extra'
import gitClone from 'git-clone'
import clipboardy from 'clipboardy'
import { hasYarn, spawn, exec } from './utils'

export default async (argv) => {
    const projectName = argv._[1]
    const starter = argv.template
    const projectCwd = path.join(process.cwd(), projectName)
    const repoUrl = `https://github.com/${starter}.git`

    if (fs.existsSync(projectCwd)) {
        throw new Error(`Project "${projectName}" already exists`)
    }

    await new Promise((resolve, reject) => {
        gitClone(repoUrl, projectCwd, (err) => {
            if (err) {
                const error = new Error(`Failed to clone "${repoUrl}" - ${err.message}`)
                error.originalError = err
                reject(error)
            } else {
                resolve()
            }
        })
    })

    console.log(`[forrest] Installing dependencies...`)
    try {
        await (await hasYarn()
            ? spawn('yarn', {
                log: console.log,
                cwd: projectCwd,
            })
            : spawn('npm install --loglevel verbose', {
                log: console.log,
                cwd: projectCwd,
            }))
    } catch (err) {
        const error = new Error(`Failed to install dependencies "${repoUrl}" - ${err.message}`)
        error.originalError = err
        throw error
    }

    console.log(`[forrest] Cleaning up...`)
    try {
        const repoPath = path.join(projectCwd, '.git')
        if (fs.existsSync(repoPath)) {
            fs.remove(repoPath)
        }
        await exec('git init', {
            log: console.log,
            cwd: projectCwd,
        })
    } catch (err) {
        const error = new Error(`Failed to cleanup project "${repoUrl}" - ${err.message}`)
        error.originalError = err
        throw error
    }

    clipboardy.writeSync(`cd ./${projectName} && npm start`)
    console.log(`[forrest] Your project is ready to use!`)
    console.log(`[forrest]     `)
    console.log(`[forrest]     cd ./${projectName} && npm start`)
    console.log(`[forrest]     `)
    console.log(`[forrest] (it's in your clipboard :-)`)
}
