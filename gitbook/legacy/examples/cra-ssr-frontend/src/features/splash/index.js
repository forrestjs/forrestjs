import splash from './splash.reducer'
import * as splashService from './splash.service'
import splashListener from './splash.listener'

export const reducers = { splash }
export const services = [splashService]
export const listeners = [splashListener]

export { default as Splash } from './Splash.container'
