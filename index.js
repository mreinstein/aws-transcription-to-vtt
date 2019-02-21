// TODO: implement multiline srt, but only if lines match from <-> to (+-tolerance)


function createMaxCharacterPerLineRule (characterPerLine = 40) {
    return (element, newElement) =>
        element.content.length + 1 + newElement.content.length < characterPerLine;
}


function createMaxTimeRule (maxTimeInMs = 1000) {
    return (element, newElement) => newElement.from - element.to < maxTimeInMs;
}


function createMaxLinesRule (maxLines = 2) {
    return (element, newElement) => element.lines < maxLines;
}


// similar to moment.duration but without having to pull in the entire moment library
function duration (ms) {
    const millisecondsPerHour = 1000 * 3600;
    const millisecondsPerMinute = 1000 * 60;

    const hours = Math.floor(ms / millisecondsPerHour);
    ms -= (hours * millisecondsPerHour);

    const minutes = Math.floor(ms / millisecondsPerMinute);
    ms -= (minutes * millisecondsPerMinute);

    const seconds = Math.floor(ms / 1000);
    ms -= (seconds * 1000); 

    return {
        hours: () => hours,
        minutes: () => minutes,
        seconds: () => seconds,
        milliseconds: () => ms
    };
}


function createTimeStamp (ms) {
    const dur = duration(ms);
    return `${
        dur.hours() > 9 ? dur.hours() : '0' + dur.hours()
        }:${
        dur.minutes() > 9 ? dur.minutes() : '0' + dur.minutes()
        }:${
        dur.seconds() > 9 ? dur.seconds() : '0' + dur.seconds()
        }.${
        dur.milliseconds() > 99 ? dur.milliseconds() : dur.milliseconds() > 9 ? '0' + dur.milliseconds() : '00' + dur.milliseconds()
        }`;
}



export default function awsTranscribeToVtt (event, { characterPerLine = 40, maxLines = 2, maxTimeInMs = 1000 } = { }) {
    const wordsToLineMergeRules = [
        createMaxCharacterPerLineRule(characterPerLine),
        createMaxTimeRule(maxTimeInMs)
    ];

    const multilineMergeRules = [
        createMaxLinesRule(maxLines),
        createMaxTimeRule(maxTimeInMs)
    ];

    return 'WEBVTT\n\n'
        + event.results.items
            .map((e) => ({
                content: e.alternatives[0].content,
                from: Math.floor(parseFloat(e.start_time) * 1000),
                to: Math.floor(parseFloat(e.end_time)) * 1000,
                characterCount: e.alternatives[0].content.length,
                //pronunciation|punctuation
                type: e.type,
                lines: 1
            }))
            .reduce((acc, cur) => {
                if (acc.length === 0) {
                    return [cur]
                }

                const last = acc[acc.length - 1];

                if (cur.type === 'pronunciation') {

                    const shouldMerge = wordsToLineMergeRules
                        .reduce((shouldMerge, rule) => shouldMerge ? rule(last, cur) : false, true);

                    if (shouldMerge) {
                        acc[acc.length - 1] = Object.assign({}, last, {
                            content: `${last.content} ${cur.content}`,
                            to: cur.to,
                            characterCount: last.characterCount + 1 + cur.characterCount
                        });

                        return acc;
                    }
                    return [...acc, cur];
                }
                //cur.type === 'punctuation'
                else {
                    acc[acc.length - 1] = Object.assign({}, last, {
                        content: `${last.content}${cur.content}`,
                        characterCount: last.characterCount + cur.characterCount
                    });
                    return acc;
                }
            }, [])
            .reduce((acc, cur) => {
                if (acc.length === 0) {
                    return [cur];
                }

                const last = acc[acc.length - 1];

                const shouldMerge = multilineMergeRules
                    .reduce((shouldMerge, rule) => shouldMerge ? rule(last, cur) : false, true);

                if (shouldMerge) {
                    acc[acc.length - 1] = Object.assign({}, last, {
                        content: `${last.content}\n${cur.content}`,
                        to: cur.to,
                        characterCount: last.characterCount + cur.characterCount,
                        lines: ++last.lines
                    });
                    return acc;
                }
                return [...acc, cur];

            }, [])
            .reduce((acc, cur, idx) => {

                return [...acc,
                    `${idx + 1}\n` +
                    `${createTimeStamp(cur.from)} --> ${createTimeStamp(cur.to)}\n` +
                    `${cur.content}\n\n`];
            }, [])
            .join('');
}
