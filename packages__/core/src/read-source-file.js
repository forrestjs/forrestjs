import fs from 'fs'

const readSourceFile = (filePath, parseJson = false, encoding = 'utf8') => new Promise((resolve, reject) => {
    if (readSourceFile.cache[filePath]) {
        return resolve(readSourceFile.cache[filePath])
    }

    try {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                reject(err)
                return
            }

            // optional json parse applied to the file
            let content = data
            if (parseJson) {
                try {
                    content = JSON.parse(data)
                } catch (err) {
                    reject(err)
                    return
                }
            }

            readSourceFile.cache[filePath] = content
            resolve(content)
        })
    } catch (err) {
        reject(err)
    }
})

// setup file cache memoization
readSourceFile.cache = {}

export default readSourceFile
