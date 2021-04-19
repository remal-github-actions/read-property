import * as core from '@actions/core'
import * as fs from 'fs'
import * as javaProps from 'java-props'
import path from 'path'
import workspacePath from './internal/workspacePath'

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

async function run(): Promise<void> {
    try {
        const file = core.getInput('file', {required: true})
        const failIfFileNotFound = core.getInput('failIfFileNotFound').toLowerCase() === 'true'
        const property = core.getInput('property', {required: true})
        const failIfPropertyNotFound = core.getInput('failIfFileNotFound').toLowerCase() === 'true'
        const defaultValue = core.getInput('defaultValue')

        const absoluteFile = path.resolve(workspacePath, file)
        if (!fs.existsSync(absoluteFile)) {
            if (failIfFileNotFound) {
                throw new Error(`Properties file can't be found: ${absoluteFile}`)
            } else {
                core.setOutput('result', defaultValue)
                return
            }
        }

        const properties = await javaProps.parseFile(absoluteFile)
        const value = properties[property]
        if (value == null) {
            if (failIfPropertyNotFound) {
                throw new Error(`Property '${property}' can't be found in properties file: ${absoluteFile}`)
            } else {
                core.setOutput('result', defaultValue)
                return
            }
        }

        core.setOutput('result', value)

    } catch (error) {
        core.setFailed(error)
    }
}

//noinspection JSIgnoredPromiseFromCall
run()
