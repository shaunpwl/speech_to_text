//GOOGLE_APPLICATION_CREDENTIALS=speech-to-text-289315-680dcaeff9ec.json node app/index_short_audio_file.js

async function main() {
  // Imports the Google Cloud client library
  const fs = require("fs");
  const speech = require("@google-cloud/speech");
  const path = require("path");

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const filename = "60s_file-2.mp3";
  const filepath = path.join(__dirname, "..", "resources", filename);
  const encoding = "MP3";
  const sampleRateHertz = 16000;
  const languageCode = "en-SG"; //	 en-US

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    content: fs.readFileSync(filepath).toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };

  const logFile = path.join(
    __dirname,
    "..",
    "logs",
    `${filename}_${languageCode}.log`
  );

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  fs.writeFileSync(logFile, JSON.stringify(response));
  fs.appendFileSync(logFile, `Transcription: ${transcription}`);
}

main().catch(console.error);
