const fs = require('fs');

/**
 * class to create a new config object
 */
class Config {
    #_configKeysSet
    #params
    /**
     * 
     * @param {object} params 
     * @param {string} params.filename
     * @param {boolean} params.setEnv (default = true)
     * @param {boolean} params.overwriteExistingEnv (default = false)
     * @param {number} params.watchIntervalMs
     * @param {boolean} params.debug (Default = false)
     */
    constructor(params = {}) {
        try {
            let that = this
            that.#_configKeysSet = new Set() // used to keep track of what we have set and so can reset

            params.setEnv = params.setEnv === false || params.setEnv === 'false' ? false : true
            params.overwriteExistingEnv = params.overwriteExistingEnv === true || params.overwriteExistingEnv === 'true' ? true : false
            params.debug = params.debug === true || params.debug === 'true' ? true : false
            params.watchIntervalMs = isNaN(params.watchIntervalMs) ? 5000 : Math.floor(params.watchIntervalMs)

            if (params.watchIntervalMs <= 0) {
                throw new Error('watchIntervalMs must be a positive number')
            }

            if (!params.filename) {
                // filename was not explicitly provided
                if (fs.existsSync('config.ini')) {
                    params.filename = 'config.ini'
                } else if (fs.existsSync('config.json')) {
                    params.filename = 'config.json'
                } else if (fs.existsSync('config.js')) {
                    params.filename = 'config.js'
                } else {
                    params.filename = ''
                }
            }

            that.#params = params

            Config._parseAndAssign.call(that, params)
            // setup a watch
            fs.watchFile(params.filename, { persistent: false, interval: params.watchIntervalMs }, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    // file has changed
                    Config._parseAndAssign.call(that, params)
                }
            });

        } catch (e) {
            // silent on error
            this.error = e.message
        }
    }

    log(message) {
        if (this.#params.debug) {
            console.log(`[mh-config][DEBUG] ${message}`)
        }
    }

    static _parseAndAssign(params = {}) {
        let parsedFile = {}
        switch (params.filename.split('.').slice(-1)[0]) {
            case 'ini':
                let fileContents = fs.readFileSync(params.filename, 'utf8')
                fileContents.split(/\r\n?|\n/).forEach(line => {
                    let matchers = line.match(/^\s*(?<key>[^;]+)\s*=\s*(?<value>.*)?\s*$/)
                    if (matchers !== null) {
                        let value = matchers.groups.value
                        // parse values to number if possible
                        let parseIntValue = Number(value)
                        if (!isNaN(parseIntValue)) {
                            parsedFile[matchers.groups.key] = parseIntValue
                        } else {
                            parsedFile[matchers.groups.key] = value
                        }

                    }
                })
                break;
            case 'json':
                parsedFile = JSON.parse(fs.readFileSync(params.filename))
                break;
            case 'js':
                let isPath = params.filename[0] === '.' || params.filename[0] === '/' || params.filename[0] === '\\' ? true : false
                delete require.cache[require.resolve(isPath ? params.filename : './' + params.filename)]
                parsedFile = require(isPath ? params.filename : './' + params.filename)
                break;
            default:
                throw new Error('Config file-type must have on of the supported file extensions: ini / json / js')
                break;
        }

        // remove any quotes from parsedFile values
        for (let [k, v] of Object.entries(parsedFile)) {
            if ((v[0] === v[v.length - 1] && v[0] === '\'') || (v[0] === v[v.length - 1] && v[0] === '"')) {
                parsedFile[k] = v.slice(1, -1)
            }
        }
        
        // set config
        Object.assign(this, parsedFile)
        // set Env
        if (params.setEnv) {
            for (let [k, v] of Object.entries(parsedFile)) {
                if (params.overwriteExistingEnv || !(process.env[k] && !this.#_configKeysSet.has(k))) {
                    // Either overwriteExistingEnv OR only if not already exists OR exists and was created by us
                    process.env[k] = v
                    this.#_configKeysSet.add(k)
                } else {
                    this.log(`"${k}" is already defined in \`process.env\` and will not be overwritten`)
                }
            }
        }
    }
}

module.exports = (options) => new Config(options);