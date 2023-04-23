require('dotenv').config();
const { get } = require('express/lib/response');
const Data = require('../models/data');

function getImpContent(file, contentBase64) {
  let decodedContent = Buffer.from(contentBase64, 'base64').toString(); // Decode Base64 contents

  let lines = decodedContent.split('\n');
  if (lines.length < 25) {
    return '\nfile name: ' + file + '\ngist of the file: ' + lines;
  }
  let first10 = lines.slice(0, 5).join('\n');
  let middle10Start = Math.floor(lines.length / 2) - 5;
  let middle10End = middle10Start + 10;
  let middle10 = lines.slice(middle10Start, middle10End).join('\n');
  let last10 = lines.slice(-10).join('\n');
  return (
    '\nfile name: ' + file + '\ngist of the file: ' + first10 + '...' + middle10 + '...' + last10
  );
}

function getContent(file, contentBase64) {
  let decodedContent = Buffer.from(contentBase64, 'base64').toString(); // Decode Base64 contents

  let lines = decodedContent.split('\n');
  if (lines.length < 5000) {
    return '\nfile name: ' + file + '\ngist of the file: ' + lines;
  }

  let first1500 = lines.slice(0, 1500).join('\n');
  let middle1500Start = Math.floor(lines.length / 2) - 750;
  let middle1500End = middle1500Start + 1500;
  let middle1500 = lines.slice(middle1500Start, middle1500End).join('\n');
  let last1500 = lines.slice(-1500).join('\n');

  return (
    '\nfile name: ' +
    file +
    '\ngist of the file: ' +
    first1500 +
    '...' +
    middle1500 +
    '...' +
    last1500
  );
}

async function promptFrom(message) {
  const arr = message.split('.@.@.');
  let context = arr[2];
  if (context == arr[1].split('#')[1]) {
    context = null;
  }
  const data = await Data.findByKey(arr[1]);
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
      if (context && !file.includes(context)) continue; //context set to particular file
      if (context) prompt += getContent(file, tree[file].content);
      else prompt += getImpContent(file, tree[file].content);
      i += 1;
      if (prompt.length > 5000) break;
    }
    prompt += '\nbased on the above codebase details, please answer the query - \n';
    prompt += arr[0];
    console.log('PROMPT:', prompt);
    return prompt;
  }
}

async function replyGPT(message) {
  const { ChatGPTAPI } = await import('chatgpt');

  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = await promptFrom(message);
  const res = await api.sendMessage(prompt);
  return res.text;
}

module.exports = { replyGPT };
