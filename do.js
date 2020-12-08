/**
 * Performs the configurations without having to require the module in code
 * Usage:
 *  node -r mh-config/do <app.js>
 */

let options = {}

for (param of process.argv) {
    let matches = param.match(/config_option_(?<key>[^=]*)=(?<value>.*)/)
    if (matches !== null) {
        // stars with config_param_
        options[matches.groups.key] = matches.groups.value
    }
}
require('./index')(options);