import fs from "fs";
import axios from "axios";

export async function textToSpeech(text: string, outputFile: string) {
  try {
    const response = await axios.post(
      process.env.TTS_API_URL as string,
      { input: text },
      {
        responseType: "stream",
        headers: { authorization: `Bearer ${process.env.TTS_TOKEN}` },
      }
    );

    const writer = fs.createWriteStream(outputFile);
    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log("File saved successfully!");
    });
    writer.on("error", (error) => {
      console.error("Error writing file:", error);
    });
  } catch (error) {
    console.error("error downliading audio", error);
  }
}
