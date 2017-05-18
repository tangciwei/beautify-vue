/**
 * @file index.js
 * @author tangciwei(tangciwei@qq.com)
 *
 * @since 2017-05-18
 */

let exec = require('child_process').exec;
let fecs = require('fecs');
let chalk = require('chalk');

module.exports = (type) => {
    let mapType = {
        js: '--type=js',
        css: '--type=css',
        vue: '--type=vue'
    };
    let command = mapType[type];

    if (!command) {
        command = '--type=vue';
    }
    let options = fecs.getOptions([command]);

    fecs.check(options, (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log(chalk.red('【强制性错误有】'));

        let fileCount = 0;
        let errNum = 0;
        data.forEach(item => {
            let filename = item.relative;
            let errors = item.errors;
            errors = errors.filter(item2 => item2.severity === 2);

            if (errors.length > 0) {
                fileCount++;
                console.log(chalk.yellow('[' + fileCount + '. ' + filename + ']'));
            }

            let errorCount = 0;
            errors.forEach(unit => {
                errorCount++;
                let line = unit.line;
                let column = unit.column;
                let message = unit.message;
                let lc = '  ' + errorCount + '. ' + line + '行' + column + '列: ';
                let info = chalk.red(lc) + chalk.green(message);
                console.log(info);
            });
            errNum += errorCount;
        });
        console.log(chalk.red('错误总数: ' + errNum));
    });
};
