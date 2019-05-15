const path = require('path')
const express = require('express')

/**
 * Settings
 * - build (string) - client app build absolute path
 */
export const serveBuild = settings =>
    express.static(path.join(settings.root, settings.build))
