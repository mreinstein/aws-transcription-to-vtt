# aws-transcription-to-vtt

![tests](https://github.com/mreinstein/aws-transcription-to-vtt/actions/workflows/main.yml/badge.svg)


Takes the JSON from [Amazon AWS Transcribe](https://aws.amazon.com/transcribe/) and outputs a VTT file.

I couldn't find a module satisfying all of these criteria:
* has documentation
* has tests
* pure es module
* 0 dependencies
* is tiny (< 150 lines of code)

so here we are.


inspired by https://github.com/s2texperiments/aws-transcription-to-subtitle


## api

```javascript
const vtt = vttConvert(json)
```

`json` is an object returned from Amazon's transcribe service

returns a string consisting of the json converted to `vtt` format.


## full example

```javascript
import vttConvert from 'aws-transcription-to-vtt'


const json = {
	results: {
        transcripts: [
            {
                transcript: "Wait."
            }
        ],
        items: [
            {
                start_time: "7.84",
                end_time: "12.87",
                alternatives: [
                    {
                        confidence: "0.4523",
                        content: "Wait"
                    }
                ],
                type: "pronunciation"
            },
            {
                alternatives: [
                    {
                        confidence: null,
                        content: "."
                    }
                ],
                type: "punctuation"
            }
        ]
    }
}

const vtt = vttConvert(json)
```

`json` is an object returned from Amazon's transcribe service

returns a string consisting of the json converted to `vtt` format.


## testing
```bash
npm test
```
