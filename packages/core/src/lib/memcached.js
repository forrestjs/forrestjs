/**
 * SSR Memcached
 * -------------
 * 
 * This is a simple in-memory cache layer applied to the server side rendering.
 * It is suitable for small websites with a limited amount of contents.
 * 
 * NOTE: this uses the server's RAM, it's a limited resource, use it carefully!
 * 
 * ### getCacheKey
 * 
 * this function is supposed to return an object that contains the key value plus
 * some optional meta data:
 * 
 *     {
 *        value: 'ojdoiejwow',
 *        sessionId: 22,
 *        ...
 *     }
 * 
 * The `value` should be a unique string identifier that is used to refer to the cache
 * record in a map (the `cache` map). Other meta data may be used to apply a cache
 * invalidation strategy. For instance it is usually convenient to invalidate all the
 * cached contents that are related to a specific session on logout.
 * 
 * The default, simplicistic, approac is to use the `req.url` as key value. This will
 * work very well for a simple static website.
 * 
 * But if you are handling dynamic contents or session based contents (aka user login)
 * you might want to implement this function with your own custom business logic so to
 * be able to apply a fine grained cache invalidation.
 * 
 * ### invalidateCache(string|function)
 * 
 * If called with a string will invalidate a specific cache record by it's key.
 * 
 * If called with a function it will scan the `keys` index to invalidate multiple records
 * based on the stored key's meta data:
 * 
 *     invalidateCache(key => key.sessionId === 1)
 * 
 * This example will invalidate any stored cache record who's key's meta data "sessionId"
 * has the value of "1". This is normally applied on logout or when a specific content
 * change in the server.
 * 
 */
const defaultSettings = {
    shouldCache: null, // (req, res) => true,
    getCacheKey: (req, res) => ({ value: req.url }),
    getCacheExpiry: (req, res) => 32503590000000, // year 3000, permanent default cache
    onCacheWrites: (req, res, html) => html,
    onCacheRead: (req, res, { cnt, exp, ctm }) => cnt
}

let settings = null
const cache = {}
const keys = {}

export const init = (receivedSettings = {}) => {
    settings = {
        ...defaultSettings,
        ...receivedSettings,
    }
}

// retrieve the request's cache keys and keeps up to date an index
// of all the keys that are in use. This could be used to offer
// an invalidation strategy that is based on the key meta data.
const getCacheKey = async (req, res) => {
    const key = await settings.getCacheKey(req, res)
    keys[key.value] = key
    return key
}

export const remove = async (toBeRemoved = []) => {
    // custom serializer implementation
    if (settings.serializer) {
        await settings.serializer.remove(toBeRemoved)
        return
    }

    for (const key of toBeRemoved) {
        cache[key] = null
        keys[key] = null
    }
}

export const set = async (req, res, html) => {
    if (settings.shouldCache && !await settings.shouldCache(req, res)) return false
    
    const key = await getCacheKey(req, res)
    const cacheObject = {
        ctm: Date.now(),
        exp: settings.getCacheExpiry(req, res),
        cnt: settings.onCacheWrites(req, res, html),
    }

    // custom serializer implementation
    if (settings.serializer) {
        await settings.serializer.set(key, cacheObject)
        return
    }

    cache[key.value] = cacheObject
}

export const get = async (req, res) => {
    const key = await getCacheKey(req, res)

    // custom serializer implementation
    const cacheObject = settings.serializer
        ? await settings.serializer.get(key)
        : cache[key.value]

    if (!cacheObject) return

    // expiry cache
    if (cacheObject.exp < Date.now()) {
        await remove(key.value)
        return
    }

    return settings.onCacheRead(req, res, cacheObject)
}

// apply a strategy to filter out some cache keys that need to be
// invalidated, based on some key meta data.
// @TODO: use Array.filter()
export const invalidateCache = (strategy) => {
    try {
        const toBeRemoved = []
        for (const key in keys) {
            if (keys[key] !== null && strategy(keys[key])) {
                toBeRemoved.push(key)
            }
        }
        return remove(toBeRemoved)
    } catch (err) {
        console.log(`[ssr] invalidateCache - ${err.message}`)
    }
}
