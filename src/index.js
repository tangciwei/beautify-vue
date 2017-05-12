#!/usr/bin/env node --harmony

/**
 * @file index.js
 * @author tangciwei(tangciwei@qq.com)
 *
 * @since 2017-05-12
 */

let fs = require('fs');
let path = require('path');
let util = require('./util');
let format = require('./format');
let exec = require('child_process').exec;
const HOME_PATH = require('os').homedir();

let output = path.resolve(HOME_PATH, '.beautify-vue-output');

let rootDir = process.argv[2] || process.cwd();

util.existDirectory(output, (err, data) => {
    // 创建临时目录
    if (!data) {
        fs.mkdirSync(output);
    }

    let files = util.getAllFiles(rootDir);

    files = files.filter(item => path.extname(item) === '.vue');

    let filesCount = 0;
    let filesLength = files.length;
    // 遍历文件格式化
    files.forEach(item => {
        format({
            filePath: item,
            output
        }, () => {
            filesCount++;
            if (filesCount === filesLength) {
                // 清理工作，删除目录文件
                exec('rm -rf ' + output + '/*', (err, data) => {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('\n此文件夹下的vue文件: ', rootDir);
                    console.log('格式化完毕😁');
                });
            }

        });
    });
});
