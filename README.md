- [mh-config](#mh-config)
    - [Key features](#key-features)
    - [Comparison](#comparison)
- [Installation](#installation)
- [Usage](#usage)
  - [Usage-1: Include it in your module/code](#usage-1-include-it-in-your-modulecode)
  - [Usage-2 Without modifying your code](#usage-2-without-modifying-your-code)
- [The config file](#the-config-file)
- [Options](#options)
- [Rules](#rules)
- [License](#license)


# mh-config
mh-config is a zero-dependency module that helps provide configuration to your existing or new applications in no time.

> Storing configuration separate from code (not hard-coding) is based on The Twelve-Factor App methodology.

### Key features
- Specify configuration in any file format: ini/json/js
- Provide these configurations either via a config object or simply process environment variables
- No need to edit your application's code, if you'd like it that way
- Hot reload the config file without restarting or reloading your application

### Comparison
How `mh-config` is different (& hopefully better) from the `dotenv` module?
- mh-config accepts a number of files formats such as: ini/json/js
  - So you don't need to change the format of your existing config file
  - Using a '.js' file provide eve more flexibility; you can dynamically create configuration values using javascript e.g. modifying time as per day light saving
- mh-config can be configured to hot reload the config file while your application is still running. This mean no downtime for your app!
  - This also provides the ability to modify the process environment variables available to your application on the fly

# Installation
```bash
# with npm
npm install mh-config

# or with Yarn
yarn add mh-config
```

# Usage
Two usages are possible:
1. Usage-1: Include it in your application's code
2. Usage-2: Use without modifying your application's code

## Usage-1: Include it in your module/code
```js
const config = require('mh-config')({debug:true}); 
// pass in options like debug = true

if (config.error) {
  throw config.error
}

// assuming a file named config.ini exists with username=notadmin, then

// USE eiher of the following:
process.env['username']
// OR
config['username']
```

## Usage-2 Without modifying your code
```bash
node -r mh-config/do <yourApp.js> config_option_debug=true
                                # ^^^^^^^^^^^^^^^^^^^^^^^^additional config options
```
```js
// yourApp.js

// somewhere in your app
something(process.env['username']) // username was set by mh-config, if options.setEnv = true
// OR
something(config['username']) // username was set by mh-config
```

# The config file
By default, mh-config looks for a suitable file in the current working directiry (cwd), usually the root of the project.
A suitable file is one of the following formats:
- .ini
- .json
- .js

Examples: 
```ini
; config.ini
username=trump
password="2020"
port=1880
```
```js
// config.json
{
    "username": "trump",
    "password": "2020",
    "port": 1880
}
```
```js
// config.js
module.exports = {
    "username": "trump",
    "password": "2020",
    "port": 1880
}
```

# Options
mg-config takes in config in two ways:
1. For Usage-1: via an object
2. For Usage-2: via command line arguments

| name (for usage-1)   | name (for usage-2)                 | description                                                                  | accepted values | default |
| -------------------- | ---------------------------------- | ---------------------------------------------------------------------------- | --------------- | ------- |
| filename             | config_option_filename             | the filename (/with path) where config exists. Should be relative to the CWD | <string>        | ''      |
| setEnv               | config_option_setEnv               | whether to set process's environment variable as well                        | true/false      | true    |
| overwriteExistingEnv | config_option_overwriteExistingEnv | whether to overwrite an existing environment variable                        | true/false      | false   |
| watchIntervalMs      | config_option_watchIntervalMs      | hot reload any changes to the config file every n milliSeconds               | <number>        | 5000    |
| debug                | config_option_debug                | whether to print debug messages on console                                   | true/false      | false   |

# Rules
- Each config values is converted into number if possible, unless surrounded by double/single quotes
- If filename is not provided, mh-config looks for these file names in CWD and stops looking if it finds one:
  - config.ini
  - config.json
  - config.js
- mh-config will never mess with your existing process.env unless you specifically ask it to by setting 'overwriteExistingEnv = true'
- Double and Single quotes are useful to mark a value as text e.g. "100" will be treated as a string while 100 as a number. This is only applicable for .ini files and command line arguments with -r option

# License
It's an MIT license; feel free to use as you will.
