import Env from '@ioc:Adonis/Core/Env';
import { Telegram } from "telegraf";
import { clientCredentials } from 'Config/project';
import { formattingDate } from '../../utils';


const jsonToText = (json) => {
  const jsonString = JSON.stringify(json, null, 2);
  return `\`\`\`\n${jsonString}\n\`\`\``;
}
const errorMessage = ({ action, params, response, identifier, departureCode }) => {
  const paramsCode = jsonToText(params);
  const responseCode = jsonToText(response);
  const date = formattingDate(new Date()).replace(".", ":");
  const kioskName = clientCredentials?.[identifier]?.[departureCode]?.name;
  
  let text = `Error Alert: ${action} \n`
  text+= `${kioskName} \n\n`;

  text+= `Params \n${paramsCode}\n`;

  text+= `Response \n${responseCode}`;

  text+= date;
  return text
}

const setPaidMessage = ({ action, params, response, identifier, departureCode, status }) => {
  const paramsCode = jsonToText(params);
  const responseCode = jsonToText(response);
  const date = formattingDate(new Date()).replace(".", ":");
  const kioskName = clientCredentials?.[identifier]?.[departureCode]?.name;
  
  let text = `Setpaid Alert: ${status} \n`
  text+= `${kioskName} \n\n`;

  text+= `Params \n${paramsCode}\n`

  text+= `Response \n${responseCode}`;
  
  text+= date;
  return text
}

const templateText = {
  error: (params) => errorMessage(params),
  setPaid: (params) => setPaidMessage(params) 
};

export const sendAlert = async (type, params) => {
  try {
    const telegramToken = Env.get('TELEGRAM_TOKEN');
    const teleGram = new Telegram(telegramToken);
    
    const text = templateText[type](params);
    
    teleGram.sendMessage('-4105309504', text, { parse_mode: 'MarkdownV2' });
  } catch (error) {
    console.log('telegraf error', error);
  }
}