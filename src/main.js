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

//大文字変換
function capitalizeFirstLetter(str) {
    if (str.indexOf('-') != -1) {
        var str_1 = str.slice(0, str.indexOf('-'));
        var str_2 = str.slice(str.indexOf('-') + 1);
        return str_1.charAt(0).toUpperCase() + str_1.slice(1) + '-' + str_2.charAt(0).toUpperCase() + str_2.slice(1);
    }
    else {
        return str.charAt(0).toUpperCase() + str.slice(1);    
    }
}



argv.option([
    {
        name: 'output',
        short: 'o',
        type: 'path',
        description: '取得したデータを指定したファイルに出力する',
        example: "'curl_c --output file url' or 'curl_c -o file url'"
    },
    {
        name: 'verbose',
        short: 'v',
        type: 'boolean',
        description: '詳細をログ出力',
        example: "'curl_c --verbose url' or 'curl_c -v url'"
    },
    {
        name: 'request',
        short: 'X',
        type: 'string',
        description: 'HTTPメソッドの指定',
        example: "'curl_c -X POST url' or 'curl_c --request POST url'"
    },
    {
        name: 'data',
        short: 'd',
        type: 'string',
        description: 'HTTPメソッドの指定',
        example: "'curl_c -X POST url' or 'curl_c --request POST url'"
    }
]);

// 引数をオブジェクトで取得
var arg = argv.run();

// -Xオプションが指定されていれば指定されたHTTPメソッドを格納
if (arg['options']['request']) {
    var method_set = arg['options']['request'];
} else {
    var method_set = 'GET';
}

// URL,HTTPメソッドの設定
var options = {
    url: process.argv[process.argv.length - 1],
    method: method_set
}

// POSTリクエストとしてフォームを送信
if (arg['options']['data']) {
    // optionsに追加する連想配列
    var data_set = {};

    // キーと値のセットを&で抽出
    var data_sliced = arg['options']['data'].split(/\&/);

    // キーと値を=で抽出
    data_sliced.forEach(function (key_value) {
        data_set[key_value.slice(0, key_value.indexOf('='))] = key_value.slice(key_value.indexOf('=') + 1);
    });

    // optionsに追加
    options['form'] = data_set;
}

request(options, function (error, res, body) {
    // 詳細ログの出力
    if (arg['options']['verbose']) {
        console.log("* Connected to " + res['request']['uri']['host'], "port", res['request']['uri']['port']);
        
        var header_sp = res['req']['_header'].split(/\n/);
        for (var i = 0; i < 2; i++){
            console.log('> ' + capitalizeFirstLetter(header_sp[i]));
        }
        console.log('> ');

        for (var key in res['headers']) {
            console.log('< ' + capitalizeFirstLetter(key) + ': ' + res['headers'][key]);
        }
        console.log('< ');
    }

    //　出力先のファイルが指定されていなければ標準出力
    if (typeof arg['options']['output'] == 'undefined') {
        console.log(body);
    }
    //　出力先のファイルが指定されていればファイルに出力
    else if (typeof arg['options']['output'] !== 'undefined') {
        writeFile(arg['options']['output'], body);
    }
})