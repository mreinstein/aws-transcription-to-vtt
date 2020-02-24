import fs         from 'fs';
import tap        from 'tap';
import vttConvert from '../lib';


for (const sample of [ 'expert', 'se-radio' ]) {
    const json = JSON.parse(fs.readFileSync(__dirname + '/data/' + sample + '.json'));

    const vtt = fs.readFileSync(__dirname + '/data/' + sample + '.vtt', 'utf8');
    
    tap.equals(vtt, vttConvert(json));
}
