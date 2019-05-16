const path = require('path')

/**
 * Settings
 * - ssrBuild (string) - client app build absolute path
 */
export const serveAppStatic = settings => (req, res, next) =>
    res.sendFile(path.join(settings.root, settings.build, 'index.html'))
