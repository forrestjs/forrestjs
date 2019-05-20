import pause from '@marcopeg/utils/lib/pause'
import { resetState } from '../lib/state'
import { createHook } from '../lib/create-hook'
import { registerAction } from '../lib/register-action'

describe('hooks/serie', () => {
    beforeEach(resetState)

    it('should run hooks', async () => {
        const handler = jest.fn()
        registerAction({
            hook: 'foo',
            handler: async () => {
                await pause()
                handler()
            }
        })
        await createHook('foo', { async: 'parallel'})
        expect(handler.mock.calls.length).toBe(1)
    })

})