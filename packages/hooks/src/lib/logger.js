
// memoize log level at request time because it might be loaded
// from a `.env.xxx` file at boot time
const getLogLevel = () => {
    if (!getLogLevel.cache) {
        getLogLevel.cache = String(process.env.LOG_LEVEL).toLowerCase()
    }
    return getLogLevel.cache
}

export const log = (text) => {
    if ([ 'debug', 'silly' ].indexOf(getLogLevel()) !== -1) {
        console.log(text)
    }
}

export const logAction = (text, action) => {
    const name = `${action.name}@${action.hook}`
    const trace = action.trace && action.trace !== 'unknown' ? `(origin: ${action.trace})` : ''
    log(`[hook] ${text} - "${name}" ${trace}`)
}
