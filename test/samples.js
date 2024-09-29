import assert     from 'node:assert';
import fs         from 'fs';
import test       from 'node:test';
import vttConvert from '../index.js';

const __dirname = import.meta.dirname;


test('samples', function (t) {

    for (const sample of [ 'expert', 'se-radio' ]) {
        const json = JSON.parse(fs.readFileSync(__dirname + '/data/' + sample + '.json'));

        const vtt = fs.readFileSync(__dirname + '/data/' + sample + '.vtt', 'utf8');
        
        assert.equal(vtt, vttConvert(json));
    }
})
