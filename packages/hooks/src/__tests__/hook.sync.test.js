import { resetState } from '../lib/state'
import { createHook } from '../lib/create-hook'
import { registerAction } from '../lib/register-action'

describe('hooks/sync', () => {
    beforeEach(resetState)

    it('should run hooks', () => {
        const handler = jest.fn()
        registerAction({
            hook: 'foo',
            handler,
        })
        createHook('foo')
        expect(handler.mock.calls.length).toBe(1)
    })

    it('should log action names', () => {
        const ac1 = { hook: 'foo', name: 'ac1', handler: () => {} }
        const ac2 = { hook: 'foo', handler: function ac2 () {} }

        registerAction(ac1)
        registerAction(ac2)

        const results = createHook('foo')

        expect(results[0][1].name).toBe('ac1')
        expect(results[1][1].name).toBe('ac2')
    })
})