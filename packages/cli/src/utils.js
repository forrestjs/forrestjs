import { spawn as spawnCmd, exec as execCmd } from 'child_process'

export const spawn = (cmd, options = {}) => {
    return new Promise((resolve, reject) => {
        const tokens = cmd.split(' ')
        const { log, ...otherOptions } = options
        let lastErrorMsg = ''
        
        const process = spawnCmd(tokens.shift(), tokens, otherOptions)

        if (log) {
            process.stdout.on('data', data => {
                log(data.toString().trim())
            })
        }
        
        process.stderr.on('data', data => {
            lastErrorMsg = data.toString().trim()
        })

        process.on('close', code => {
            if (code === 0) {
                resolve(code)
            } else {
                const error = new Error(lastErrorMsg)
                error.spawnCode = code
                reject(error)
            }
        })

        process.on('error', err => {
            reject(err)
        })
    })
}

export const exec = (cmd, options = {}) => {
    return new Promise((resolve, reject) => {
        execCmd(cmd, options, (err, stdout, stderr) => {
            if (err) {
                reject(new Error(err))
                return
            }
            resolve(stdout.toString())
        })
    })
}

export const hasYarn = async () => {
    try {
        await exec('which yarn')
        return true
    } catch (err) {
        return false
    }
}
