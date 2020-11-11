const fs = require('fs')
const path = require('path')
const md5File = require('md5-file')
const mimeTypes = require('mime-types')
const register = require('ignore-styles').default

export const createSSRRegisterHook = (settings) => {
    const importExtensions = settings.embedExt.split(',')
    const importLimit = settings.embedLimit

    register(undefined, (mod, filename) => {
        try {
            const ext = importExtensions.find(f=>filename.endsWith(f))
            if (!ext) {
                return
            }

            // embed image as base64
            if (fs.statSync(filename).size < importLimit) {
                const file = fs.readFileSync(filename).toString('base64')
                const mimeType = mimeTypes.lookup(ext) || 'image/jpg'
                mod.exports = `data:${mimeType};base64,${file}`

            // link image to the media folder
            } else {
                const hash = md5File.sync(filename).slice(0, 8)
                const bn = path.basename(filename).replace(/(\.\w{3})$/, `.${hash}$1`)
                mod.exports = `/static/media/${bn}`;
            }
        } catch (err) {
            console.log(`[ssr] ignore-styles :: ${err.message}`)
            console.log(err)
        }
    })
}
