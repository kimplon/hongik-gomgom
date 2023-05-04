import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat', {
      prompt: text,
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },

      
    });
    res.json({ text: response.data.choices[0].text });
    res.send(response.data.choices[0].text.trim());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
