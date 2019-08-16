import uuid from 'uuid'

export const addDeviceId = ({
    attributeName,
    setCookie: useCookies,
    cookieName,
    cookieMaxAge,
    setHeader,
    headerName,
    useClientCookie,
    uuidVersion,
    buffer,
    offset,
    ...config
}) => (req, res, next) => {
    const getCookie = useClientCookie ? req.getClientCookie : req.getCookie
    const setCookie = useClientCookie ? res.setClientCookie : res.setCookie

    if (useCookies && (!getCookie || !setCookie)) {
        // eslint-disable-next-line
        throw new Error('Please install "service-express-cookies" before "service-express-device"')
    }

    // Get the deviceId from the headers, cookie, or generate a new one
    req[attributeName] = req.headers[headerName] || getCookie(cookieName) || uuid[uuidVersion](config, buffer, offset)

    // Set header and cookie value
    useCookies && setCookie(cookieName, req[attributeName], { maxAge: cookieMaxAge })
    setHeader && res.set(headerName, req[attributeName])

    next()
}
