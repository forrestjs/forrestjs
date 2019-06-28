import { registerAction } from '../lib/register-action'
import { createHook } from '../lib/create-hook'
import { resetState } from '../lib/state'

describe('createHook()', () => {
    beforeEach(resetState)

    test('hooks should carry on a context', () => {
        registerAction('foo', (args, ctx) => {
            expect(args.foo).toBe(1)
            expect(ctx.foo).toBe(2)
        })
        createHook('foo', {
            args: { foo: 1 },
            context: { foo: 2 },
        })
    })    
})
