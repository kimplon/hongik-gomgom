import * as dotenv from 'dotenv';
import fs from "fs";
import readline from 'readline';
dotenv.config({path:'../../.env'});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

conversationLog = loadConversationLog();


console.log("이야기치료법 기반 심리상담 앱\n");



rl.prompt();

rl.on("line", (question) => {
  // 이전 대화 내용을 요약한 메시지 생성
  const lastMessages = conversationLog.slice(-100).map((msg) => `${msg.role}: ${msg.content}`).join("\n");
  const messageSummary = lastMessages.length > 0 ? `Last Messages:\n${lastMessages}` : "";

//   console.log(messageSummary);

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "assistant",content : "너는 이야기 치료법을 공부했고 그걸 기반으로 user의 심리를 상담해주는 상담사로 이야기를 들어주는 bot이야. 너와 앞으로 대화할 user는 내담자이고. 그에게 공감을 해주는 것을 바탕으로 해결책을 바로 제시하기보단 어떤일이 있는지 감정은 어떤지를 중심으로 질문을 계속해줘야해." }, 
        {role: "assistant", content: messageSummary},
        {role: "user", content: question }],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const answer = data.choices[0].message.content;
      console.log(`Bot: ${answer}\n`);
      conversationLog.push({ role: "user", content: question });
      conversationLog.push({ role: "bot", content: answer });
    // console.log(conversationLog);
      saveConversationLog();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
    //   loadConversationLog();
      rl.prompt();
    });
});
