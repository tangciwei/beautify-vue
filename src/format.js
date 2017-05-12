/**
 * @file format.js
 * @author tangciwei(tangciwei@qq.com)
 *
 * @since 2017-05-12
 */

let fs = require('fs');
let path = require('path');
let fecs = require('fecs');
let beautify = require('js-beautify').css_beautify;

module.exports = (option, callback) => {
    let {filePath, output} = option;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return console.log(err);
        }

        data = data.toString();

        let template = data.match(/\<template(.*)\>([\s\S]+)\<\/template\>/);
        let script = data.match(/\<script(.*)\>([\s\S]+)\<\/script\>/);
        let style = data.match(/\<style(.*)\>([\s\S]+)\<\/style\>/);
        if (!style) {
            style = ['', '', ''];
        }

        // 备份原来的标签
        let srcTag = {
            template: [
                `<template${template[1]}>`,
                '</template>'
            ],
            script: [
                `<script${script[1]}>`,
                '</script>'
            ],
            style: [
                `<style${style[1]}>`,
                '</style>'
            ]
        };

        script = script[2].trim();
        style = style[2].trim();

        // 文件名
        let filename = path.basename(filePath, '.vue');
        let tempJsname = path.resolve(output, filename + new Date().getTime() + '.js');

        // css格式化
        let styleFormat;
        if (style) {
            styleFormat = beautify(style, {
                allowed_file_extensions: ['css', 'scss', 'sass', 'less'],
                end_with_newline: false,
                indent_char: ' ',
                indent_size: 4,
                newline_between_rules: true,
                selector_separator: ' ',
                selector_separator_newline: true //
            });
        }

        // js格式化
        fs.writeFile(tempJsname, script, (err, data) => {
            if (err) {
                return console.log(err);
            }

            let options = fecs.getOptions([tempJsname, '--replace']);

            fecs.format(options, () => {
                fs.readFile(tempJsname, (err, data) => {
                    // template+js+css拼接
                    let result = template[0] + '\n'
                        + srcTag.script[0] + '\n'
                        + data + '\n'
                        + srcTag.script[1] + '\n';
                    if (style) {
                        result += srcTag.style[0] + '\n'
                            + styleFormat + '\n'
                            + srcTag.style[1] + '\n';
                    }

                    // 覆盖原来文件
                    fs.writeFile(filePath, result, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }

                        console.log(filename + '文件格式化完毕...');
                        callback();
                    });
                });
            });
        });

    });
};
