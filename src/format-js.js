let util = require('./util');
let exec = require('child_process').exec;
let fecs = require('fecs');
let path = require('path');

module.exports = (rootDir = process.cwd()) => {

    let files = util.getAllFiles(rootDir);
    files = files.filter(item => path.extname(item) === '.js');
    
    files.forEach(item => {
        // 文件名
        let filename = path.basename(item, '.js');

        let options = fecs.getOptions([item, '--replace']);

        fecs.format(options, () => {
            console.log(filename + '格式化完毕！');
        });

    });
};
