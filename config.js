var fs = require('fs');

function getVersion() {
    var file = __dirname + '/VERSION';
    var defaultVersion = '0.1.0-000001';

    if (fs.existsSync(file)) {
        return fs.readFileSync(file, 'utf8').trim();
    }

    fs.writeFileSync(file, defaultVersion, 'utf8');
    return defaultVersion;
}

module.exports = {
    version: getVersion()
};
