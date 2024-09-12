import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as tools from "../services/tools";

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
    // save data from body to data.json file

    const filePath = path.join(__dirname, "data.json");

    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
      if (err) {
        console.error("error writing file", err);
        return res.status(500).json({ message: "failed to save the file" });
      }
    });

    // build the stucture for send to discord
    const message = tools.buildMessage(req.body);

    const sendDiscordWebhook = await tools.DiscordWebhook(message);

    res.json({
      success: true,
      message: "send message to discord webhook successfully",
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send(String(err));
  }
};
