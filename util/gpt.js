require('dotenv').config();
const { get } = require('express/lib/response');
const Data = require('../models/data');

function getImpContent(file, contentBase64) {
  let decodedContent = Buffer.from(contentBase64, 'base64').toString(); // Decode Base64 contents

  let lines = decodedContent.split('\n');
  if (lines < 25) {
    return '\nfile name: ' + file + '\ngist of the file: ' + lines;
  }
  let first10 = lines.slice(0, 5).join('\n');
  let middle10Start = Math.floor(lines.length / 2) - 5;
  let middle10End = middle10Start + 10;
  let middle10 = lines.slice(middle10Start, middle10End).join('\n');
  let last10 = lines.slice(-10).join('\n');
  return (
    '\nfile name: ' + file + '\ngist of the file' + first10 + '...' + middle10 + '...' + last10
  );
}

// function getImpContent(file, contentBase64) {
//   decoded_content = base64.b64decode(contentBase64).decode('utf-8');
//   return '\nfile name: ' + file + '\ncontent (base64): ' + contentBase64;
// }

async function promptFrom(message) {
  const data = await Data.findByKey('56480355#whatTODO');
  if (data) {
    const tree = data.data;
    let i = 0;
    let prompt = 'Codebase details: ';
    for (let file in tree) {
      if (
        file.includes('jar') ||
        file.includes('wrapper') ||
        file.includes('cmd') ||
        file.includes('mvnw')
      )
        continue;
      prompt += getImpContent(file, tree[file].content);
      console.log(getImpContent(file, tree[file].content));
      i += 1;
      if (prompt.length > 3000) break;
    }
    prompt +=
      'based on the above codebase details, please answer the query. I want the answer only in simple text no highlighting/code -';
    prompt += message;
    console.log(prompt);
    return prompt;
  }
}

async function replyGPT(message) {
  const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');

  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_ACCESS_TOKEN,
    apiReverseProxyUrl: 'https://bypass.churchless.tech/api/conversation',
  });
  const prompt = await promptFrom(message);
  const res = await api.sendMessage(prompt);
  console.log(prompt);
  //console.log(res.text);
  return res.text;
}

module.exports = { replyGPT };
