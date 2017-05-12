var fs = require('fs');

let getAllFiles = root => {
    var res = [];
    var files = fs.readdirSync(root);

    files.forEach(function (file) {
        var pathname = root + '/' + file;
        var stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            res.push(pathname);
        }
        else {
            res = res.concat(getAllFiles(pathname));
        }
    });
    return res;
};

module.exports = {
    existDirectory(path, callback) {
        fs.stat(path, (err, stat) => {

            if (err == null) {
                if (stat.isDirectory()) {
                    callback(null, true);
                }
            }
            else if (err.code == 'ENOENT') {
                callback(null, false);
            }
            else {
                callback(err);
            }

        });
    },
    getAllFiles
};
