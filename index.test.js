const config = require('./index')({
    debug: true,
    // filename: './config.json',
    // filename: 'config.js',
    filename: 'config.ini'
});

console.log(config)
console.log(process.env.username)
console.log(process.env.password)
console.log(process.env.port)
console.log(process.env.ping)
setInterval(() => {
    console.log(config)
    console.log(process.env.username)
    console.log(process.env.password)
    console.log(process.env.port)
    console.log(process.env.ping)
}, 5000)

// the tests definitely need more work