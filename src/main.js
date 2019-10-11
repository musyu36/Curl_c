console.log(process.argv);
console.log(process.argv[2]);

var request = require('request');

var options = {
    url: process.argv[2],
    method: 'GET'
}

request(options, function (error, response, body) {
    console.log(body);
})