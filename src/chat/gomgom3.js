//localhost3001

import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config({path:'../../.env'});

const app = express();
const port = 3001;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chatBotRole = process.env.chatBotRole;
const messageSummary="User : 내 이름은 신유승이야";
const rules= process.env.rules;

app.get('/chat', async (req, res) => {
  const { question } = req.query;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:[
        {role: "assistant",content : "너는 이야기 치료법을 공부했고 그걸 기반으로 user의 심리를 상담해주는 상담사로 이야기를 들어주는 bot이야. 너와 앞으로 대화할 user는 내담자이고. 그에게 공감을 해주는 것을 바탕으로 해결책을 바로 제시하기보단 어떤일이 있는지 감정은 어떤지를 중심으로 질문을 계속해줘야해." }, 
        {role: "assistant", content: messageSummary},
        {role: "user", content: question }
    ],    
  });
  res.send(response.data.choices[0].message.content);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
