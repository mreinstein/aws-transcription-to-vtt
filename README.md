# aws-transcription-to-vtt

Takes the JSON from [Amazon AWS Transcribe](https://aws.amazon.com/transcribe/) and outputs a VTT file.


## including
import vttConvert from 'aws-transcription-to-vtt'  // modern es modules approach

// *OR*

const vttConvert = require('aws-transcription-to-vtt') // commonjs (node) approach


## api

```javascript
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
```javascript
node test
```