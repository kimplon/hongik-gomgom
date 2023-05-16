//localhost3000

import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config({path:'../../.env'});

const app = express();
const port = 3000;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/chat', async (req, res) => {
  const { question } = req.query;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `User: ${question}\nBot:`,
    temperature: 0.5,
    max_tokens: 100,
    stop: ["User:"],
  });
  res.send(response.data.choices[0].text.trim());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
