import axios from "axios";

const user = [
  { email: "firstlnw0099@gmail.com", discord_id: "325658446672166912" },
  { email: "nooknet102@gmail.com", discord_id: "313328014710800384" },
  { email: "chonlatee1129@gmail.com", discord_id: "312455071038308362" },
  { email: "apiwat.r.janapaisarn@gmail.com", discord_id: "735061999800549398" },
  { email: "kitsada8621@gmail.com", discord_id: "804377551438086184" },
];

export const ErrorModel = (data: string) => {
  return {
    error: true,
    message: data,
  };
};

export const DiscordWebhook = async (data: string) => {
  await axios.post(process.env.DISCORD_WEBHOOK as string, {
    content: data,
  });
  return true;
};

const findDiscordId = (email: string) => {
  const findUser = user.find((u: any) => u.email === email);
  return findUser ? findUser.discord_id : email;
};

export const buildMessage = (data: any) => {
  const buildstage = buildStage(data.builds);
  const message = `# Project ${data.project?.name} \n
  **Status :** ${data.object_attributes?.status}
  **Branch :** ${data.object_attributes?.ref} 
  **User :** <@${findDiscordId(data.commit.author.email)}> 
  ** QA มาส่อง Deploy:** <@361527742522458113>
  **Commit :** [${data.commit.title}](${data.commit.url}) \n
  **Description :** ${data.commit.message}\n
  **Pipeline URL:** [View](${data.object_attributes.url})\n
  **Build Stage**\n
  ${buildstage}
    `;

  return message;
};

export const statusEmoji = (status: string) => {
  if (status === "success") {
    return "✅";
  } else if (status === "failed") {
    return "⛔";
  } else if (status === "skipped") {
    return "⏩";
  }

  return "🚧";
};

export const buildStage = (build: object[] = []) => {
  const stageUse = ["build", "migrate", "deploy"];

  if (!Array.isArray(build) || build.length === 0) {
    return "No build Stages avliable.";
  }

  const filter = build.filter((item: any) => stageUse.includes(item.stage));

  const groupData = stageUse.map((stage: any) => {
    const itemForStage = filter.filter((item: any) => item.stage === stage);
    return { stage, items: itemForStage };
  });

  let result = ``;

  groupData.forEach((group: any) => {
    if (group.items.length > 0) {
      result += `**stage:** ${group.stage}\n`;
      group.items.forEach((item: any) => {
        result += `${statusEmoji(item.status)}  **Name:**  ${item.name}\n`;
      });
      result += `\n`;
    }
  });

  return result.trim();

  //   console.log(groupData);
};
