// import pause from '@marcopeg/utils/lib/pause'
import { resetState } from '../lib/state'
import { runHookApp } from '../lib/create-hook-app'
import { registerAction } from '../lib/register-action'
import * as constants from '../lib/constants'

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

    it('should run an app that provides settings as a function', async () => {
        await runHookApp({
            settings: ({ setConfig }) => {
                setConfig('foo.faa', 22)
            },
            features: [
                [
                    constants.START_FEATURE,
                    ({ getConfig }) => expect(getConfig('foo.faa')).toBe(22),
                ],
            ]
        })
    })

    it('should provide a config getter to any registered action', async () => {
        await runHookApp({
            settings: ({ setConfig }) => {
                setConfig('foo.faa', 22)
            },
            services: [
                // register a feature
                ({ registerAction }) => registerAction({
                    hook: constants.INIT_SERVICE,
                    handler: ({ getConfig, setConfig }) => setConfig('foo', getConfig('foo.faa') * 2),
                }),
            ],
            features: [
                // register a single action
                [
                    constants.START_FEATURE,
                    ({ getConfig }) => expect(getConfig('foo')).toBe(44),
                ],
            ]
        })
    })

    it('should lock a context and decorate it with internal methods', async () => {
        await runHookApp({
            settings: {
                increment: 1,
            },
            context: {
                foo: (args, ctx) => args.value + ctx.getConfig('increment'),
            },
            services: [
                [constants.START_SERVICE, async ({ createHook }) => {
                    const r1 = createHook.sync('aaa', { value: 1 })
                    expect(r1[0][0]).toBe(2)

                    const r2 = await createHook.serie('bbb', { value: 1 })
                    expect(r2[0][0]).toBe(2)
                    
                    const r3 = await createHook.parallel('ccc', { value: 1 })
                    expect(r3[0][0]).toBe(2)
                }],
            ],
            features: [
                [ 'aaa', (args, ctx) => ctx.foo(args, ctx) ],
                [ 'bbb', (args, ctx) => ctx.foo(args, ctx) ],
                [ 'ccc', (args, ctx) => ctx.foo(args, ctx) ],
            ]
        })
    })

    describe('createHookApp getters / setters', () => {
        it('SETTINGS should not pass reference to the internal object', async () => {
            registerAction(constants.SETTINGS, ({ settings }) => {
                expect(settings).toBe(undefined)
            })
            await runHookApp({ settings: { foo: 1 } })
        })

        it('should handle settings with getters/setters', async () => {
            registerAction(constants.SETTINGS, ({ getConfig, setConfig }) => {
                setConfig('foo', getConfig('foo') + 1)
            })
            const app = await runHookApp({ settings: { foo: 1 } })
            expect(app.settings.foo).toBe(2)
        })

        it('should handle settings with nested paths', async () => {
            registerAction(constants.SETTINGS, ({ getConfig, setConfig }) => {
                setConfig('new.faa.foo', getConfig('foo') + 1)
            })
            const app = await runHookApp({ settings: { foo: 1 } })
            expect(app.settings.new.faa.foo).toBe(2)
        })
    })

})