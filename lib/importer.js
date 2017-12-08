// 动态加载器
let fs = require('fs');
let path = require('path');
let debug = require('debug')('importer');

function dispatchImporter() {
    function importer(from) {
        from = path.relative(process.cwd(), from);
        // console.log(from);
        let imported = {};
        let joinPath = function () {
            return process.cwd() + path.sep + path.join(...arguments);
        };
        let fsPath = joinPath(from);
        fs.readdirSync(fsPath).forEach((name) => {
            // console.log(name);
            let info = fs.statSync(path.join(fsPath, name));
            if (info.isDirectory()) {
                imported[name] = importer(joinPath(from, name));
            } else {
                let ext = path.extname(name);
                let base = path.basename(name, ext);
                if (require.extensions[ext]) {
                    // console.log(path.join(fsPath, name));
                    imported[base] = require(path.join(fsPath, name));
                } else {
                    debug('cannot require ', name);
                }
            }
        });
        return imported;
    }

    return importer;
}

module.exports = dispatchImporter;
