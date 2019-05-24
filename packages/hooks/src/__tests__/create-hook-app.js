// import pause from '@marcopeg/utils/lib/pause'
import { resetState } from '../lib/state'
// import { createHook } from '../lib/create-hook'
// import { registerAction } from '../lib/register-action'
import { runHookApp } from '../lib/create-hook-app'

describe('hooks/create-hook-app', () => {
    beforeEach(resetState)

    it('should run an empty app', async () => {
        await runHookApp()
    })

    it('should register a service or feature from an ES module', async () => {
        const handler = jest.fn()

        const s1 = {
            register: () => {
                handler()
            }
        }

        await runHookApp({
            services: [s1],
            features: [s1],
        })

        expect(handler.mock.calls.length).toBe(2)
    })

    it('should register a service or feature from a function', async () => {
        const handler = jest.fn()
        const s1 = () => handler()

        await runHookApp({
            services: [s1],
            features: [s1],
        })

        expect(handler.mock.calls.length).toBe(2)
    })

    it('should register a service as single hook setup', async () => {
        const handler = jest.fn()
        const s1 = [ 'foo', handler ]
        const f1 = ({ createHook }) => createHook('foo')

        await runHookApp({
            services: [s1],
            features: [f1],
        })

        expect(handler.mock.calls.length).toBe(1)
    })
})