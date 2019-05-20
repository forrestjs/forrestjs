/**
 * This is a utility script that pack all the translatable message into
 * a single json file that is easy to maintain and translate.
 */

import path from 'path'
import * as fs from 'fs'
import { sync as globSync } from 'glob'
import { sync as mkdirpSync } from 'mkdirp'

const BUILD_LOCALE = process.env.REACT_SSR_BUILD_LOCALE || 'build-locale'
const MESSAGES_PATTERN = path.join(process.cwd(), BUILD_LOCALE, '**/*.json')
const LANG_DIR = path.join(process.cwd(), 'src', 'locale')
const DEFAULT_LANG = 'en'

const ESCAPED_CHARS = {
    '\\': '\\\\',
    '\\#': '\\#',
    '{': '\\{',
    '}': '\\}',
}

const ESAPE_CHARS_REGEXP = /\\#|[{}\\]/g

export default function printICUMessage (ast) {
    return ast.elements.reduce((message, el) => {
        let { format, id, type, value } = el

        if (type === 'messageTextElement') {
            return message + value.replace(ESAPE_CHARS_REGEXP, (char) => {
                return ESCAPED_CHARS[char]
            })
        }

        if (!format) {
            return message + `{${id}}`
        }

        let formatType = format.type.replace(/Format$/, '')

        let style, offset, options

        switch (formatType) {
            case 'number':
            case 'date':
            case 'time':
                style = format.style ? `, ${format.style}` : ''
                return message + `{${id}, ${formatType}${style}}`

            case 'plural':
            case 'selectOrdinal':
            case 'select':
                offset = format.offset ? `, offset:${format.offset}` : ''
                options = format.options.reduce((str, option) => {
                    let optionValue = printICUMessage(option.value)
                    return str + ` ${option.selector} {${optionValue}}`
                }, '')
                return message + `{${id}, ${formatType}${offset},${options}}`
        }

        return null
    }, '')
}

const defaultMessages = globSync(MESSAGES_PATTERN)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((collection, descriptors) => {
        descriptors.forEach(({ id, defaultMessage }) => {
            // Duplicate messages are due to inclusion of shared message definition files.
            // ----
            // console.log(id, defaultMessage)
            // if (collection.hasOwnProperty(id)) {                
            //     throw new Error(`Duplicate message id: ${id}`)
            // }

            collection[id] = defaultMessage
        })

        return collection
    }, {})

const langFileName = DEFAULT_LANG + '.json'
const langFilePath = path.join(LANG_DIR, langFileName)
console.log(`[react-ssr] write lang file "${langFileName}" to "${langFilePath}"`)
mkdirpSync(LANG_DIR)
fs.writeFileSync(langFilePath, JSON.stringify(defaultMessages, null, 4))
