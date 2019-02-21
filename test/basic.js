import tap        from 'tap';
import vttConvert from '../index.js';


// some transcription items don't have an end_time field
const result = vttConvert(
{
    "jobName": "TRANSCRIBE-73746167696e672f612f516f334a3851326b",
    "accountId": "246651310811",
    "results": {
        "transcripts": [
            {
                "transcript": "Wait."
            }
        ],
        "items": [
            {
                "start_time": "7.84",
                "end_time": "12.87",
                "alternatives": [
                    {
                        "confidence": "0.4523",
                        "content": "Wait"
                    }
                ],
                "type": "pronunciation"
            },
            {
                "alternatives": [
                    {
                        "confidence": null,
                        "content": "."
                    }
                ],
                "type": "punctuation"
            }
        ]
    },
    "status": "COMPLETED"
});


tap.equals(result,
`WEBVTT

1
00:00:07.840 --> 00:00:12.000
Wait.

`);

