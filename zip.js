const AdmZip = require('adm-zip');

const zip = new AdmZip();
zip.addLocalFolder("dist");
zip.writeZip("tkmine-release.zip");