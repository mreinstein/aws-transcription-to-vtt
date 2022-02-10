const awsTranscribeToVtt = require("./dist/aws-transcription-to-vtt.cjs");

let buf = "";
process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
  while ((chunk = process.stdin.read()) !== null) {
    buf += chunk;
  }
});

process.stdin.on("end", () => {
  const data = JSON.parse(buf);
  console.log(awsTranscribeToVtt(data));
});
