//GOOGLE_APPLICATION_CREDENTIALS=speech-to-text-289315-680dcaeff9ec.json node app/index.js

async function main() {
  // Imports the Google Cloud client library
  const speech = require("@google-cloud/speech");
  const fs = require("fs");
  const path = require("path");

  // Creates a client
  const client = new speech.SpeechClient();

  const filename = "5to10min.mp3"; //"60s_file-1.mp3";
  const gcsUri = "gs://speech_to_text_shaunpwl/" + filename;
  const encoding = "MP3";
  const sampleRateHertz = 16000;
  const languageCode = "en-US"; //	 en-US

  const speechContexts = [
    {
      phrases: ["chruch", "sin", "amen"],
    },
  ];
  const logNumber = "3";

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    speechContexts: speechContexts,
    useEnhanced: true,
    model: "phone_call",
  };
  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  const logFile = path.join(
    __dirname,
    "..",
    "logs",
    `${filename}_${languageCode}_${logNumber}.log`
  );

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  // fs.writeFileSync(logFile, JSON.stringify(response));
  fs.appendFileSync(logFile, transcription);
}

main().catch(console.error);
