var request = require('request');
var argv = require('argv');
var fs = require('fs');

// ファイル書き込み
function writeFile(path, data) {
    fs.writeFile(path, data, function (err) {
        if (err) {
            throw err;
        }
    });
}


argv.option([
    {
        name: 'output',
        short: 'o',
        type: 'path',
        description: '取得したデータを指定したファイルに出力する',
        example: "'curl_c --output file url' or 'curl_c -o file url'"
    }
]);

// 引数を取得
var arg = argv.run();

// URL,通信種類設定
var options = {
    url: arg['targets'][0],
    method: 'GET'
}

request(options, function (error, response, body) {
    //　出力先のファイルが指定されていなければ標準出力
    if (typeof arg['options']['output'] == 'undefined') {
        console.log(body);
    }
    //　出力先のファイルが指定されていればファイルに出力
    else if (typeof arg['options']['output'] !== 'undefined') {
        writeFile(arg['options']['output'], body);
    }
})