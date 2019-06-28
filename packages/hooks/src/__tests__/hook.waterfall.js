import { createHook } from '../lib/create-hook'
import { registerAction } from '../lib/register-action'
import { resetState } from '../lib/state'

describe('hook waterfall', () => {
    beforeEach(resetState)

    test('waterfall should return its own arguments', () => {
        const res = createHook('foo', {
            mode: 'waterfall',
            args: { port: 8080 }
        })

        expect(res.value.port).toBe(8080)
    })
    
    test('waterfall should let extensions play with scalar arguments', () => {
        const ext = num => num + 1
        registerAction('foo', ext)
        registerAction('foo', ext)

        const res = createHook.waterfall('foo', 1)
        expect(res.value).toBe(3)
    })

    test('waterfall should let extensions play with object arguments', () => {
        const ext = ({ num }) => ({ num: num + 1 })
        registerAction('foo', ext)
        registerAction('foo', ext)

        const res = createHook.waterfall('foo', { num: 1 })
        expect(res.value.num).toBe(3)
    })
})
