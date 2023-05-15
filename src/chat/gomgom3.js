//api call gpt3.5turbo

import express from 'express';
import * as dotenv from 'dotenv';
import fs from "fs";
import { Configuration, OpenAIApi } from 'openai';

dotenv.config({path:'../../.env'});

const app = express();
const port = 3001;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chatBotRole    = process.env.CHATBOT_ROLE;
const userName="";
const rules= process.env.RULES;

//------------settings--------------


let conversationLog = [];

function loadConversationLog() {
    if (fs.existsSync("conversationLog.json")) {
      const logFileContent = fs.readFileSync("conversationLog.json", "utf-8");
      if (logFileContent.trim()) { // 로그 파일이 비어있지 않은 경우에만 파싱
        return JSON.parse(logFileContent);
      }
    } 
    return []; // 로그 파일이 존재하지 않거나 비어있는 경우 빈 배열 반환
}

function saveConversationLog() {
    try {
      fs.writeFileSync("conversationLog.json", JSON.stringify(conversationLog));
    } catch (err) {
      console.error("Failed to save conversation log", err);
    }
}



//console.log(conversationLog);

app.get('/chat', async (req, res) => {
  const { question } = req.query;

  conversationLog = loadConversationLog();

  const lastMessages = conversationLog.slice(-50).map((msg) => `${msg.role}: ${msg.content}`).join("\n");
  const messageSummary = lastMessages.length > 0 ? `Last Messages:\n${lastMessages}` : "";

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:[
        {role: "assistant",content : chatBotRole }, 
        {role: "assistant", content: userName},
        {role: "assistant",content : messageSummary},
        {role: "assistant",content:rules},
        {role: "user", content: question }
    ],    
  });
  const answer = response.data.choices[0].message.content;
  res.send(response.data.choices[0].message.content);
  conversationLog.push({role : "user",content:question});
  conversationLog.push({role: "bot", content: answer });
  saveConversationLog();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
