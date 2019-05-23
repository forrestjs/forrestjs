import cmdNew from '../lib/cmd-new'

jest.mock('git-clone', () => ({
    __esModule: true, 
    default: (url, cwd, cb) => {
        const err = new Error('test result')
        err.url = url
        err.cwd = cwd
        cb(err)
    }
}))

describe('Forrest CLI', () => {
    test('it should be able to clone a project from a custom repository', async () => {
        try {
            await cmdNew({
                template: 'custom/repo',
                _: [null, 'project-name']
            })
            throw new Error('it should have thrown')
        } catch (err) {
            expect(err.originalError.message).toBe('test result')
            expect(err.originalError.url).toBe('https://github.com/custom/repo.git')
        }
    })
})
