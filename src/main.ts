import * as core from '@actions/core'
import * as fs from 'fs'
import * as javaProps from 'java-props'
import path from 'path'
import workspacePath from './internal/workspacePath.js'

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
                core.info(`${property} = ${defaultValue} (default value)`)
                core.setOutput('value', defaultValue)
                return
            }
        }

        const properties = await javaProps.parseFile(absoluteFile)
        const value = properties[property]
        if (value == null) {
            if (failIfPropertyNotFound) {
                throw new Error(`Property '${property}' can't be found in properties file: ${absoluteFile}`)
            } else {
                core.info(`${property} = ${defaultValue} (default value)`)
                core.setOutput('value', defaultValue)
                return
            }
        }

        core.info(`${property} = ${value}`)
        core.setOutput('value', value)

    } catch (error) {
        core.setFailed(error instanceof Error ? error : (error as object).toString())
        throw error
    }
}

//noinspection JSIgnoredPromiseFromCall
run()
