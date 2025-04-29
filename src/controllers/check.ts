import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as tools from "../services/tools";

import {
  joinVoiceChannel,
  EndBehaviorType,
  getVoiceConnection,
} from "@discordjs/voice";
import { textToSpeech } from "../config/TTS";
import { discordClient } from "../config/discord";

const GUILD_ID = process.env.GUILD_ID as string;
const CHANNEL_ID = process.env.CHANNEL_ID as string;

export const check = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        results: "check Pass",
      },
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send(String(err));
  }
};

export const GitLabWebHook = async (req: Request, res: Response) => {
  const {
    object_kind,
    object_attributes,
    merge_request,
    user,
    project,
    commit,
    builds,
  } = req.body;
  try {
    const filePath = path.join(__dirname, "data.json");

    try {
      await fs.promises.writeFile(filePath, JSON.stringify(req.body, null, 2));
    } catch (err: unknown) {
      console.error("error writing file", err);
      return res.status(500).json({ message: "failed to save the file" });
    }
    const message = tools.buildMessage(req.body);

    await tools.DiscordWebhook(message);

    const project_name = project?.name;
    const status = object_attributes?.status;
    const branch = project?.default_branch;

    if (project_name && status) {
      const guild = await discordClient.guilds.fetch(GUILD_ID);
      const channel = await guild.channels.fetch(CHANNEL_ID);

      if (!channel?.isVoiceBased()) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid voice channel" });
      }

      joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      const connection = getVoiceConnection(GUILD_ID);

      await textToSpeech(
        `Deploy โปรเจค ${project_name} สถานะ ${status}`,
        "./response.mp3"
      );
      tools.playAudio(connection, "./response.mp3");
    }

    res.json({
      success: true,
      message: "send message to discord webhook successfully",
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send(String(err));
  }
};
