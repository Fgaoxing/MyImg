import fetch from 'node-fetch';
import fs from 'fs';

fetch('https://registry.npmmirror.com/ytblogimg/').then(function (res) {
    res.json().then(function (json) {
        if ('dist-tags' in json) {
            console.log(json['dist-tags']['latest']);
            if (json['dist-tags']['latest'].indexOf('-') === -1) {
                let v = parseInt(json['dist-tags']['latest'].split('.').join(''))
                v++;
                let file = JSON.parse(fs.readFileSync('./package.json'))
                file['version'] = v.toString().split('').join('.');
                console.log(file['version'])
                fs.writeFileSync('./package.json', JSON.stringify(file, '', '\t'))
            }
        }
    }).catch(function (err) {
        console.log(err);
    })
}).catch(function (err) {
    console.log(err);
})
