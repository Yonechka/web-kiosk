"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlert = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const telegraf_1 = require("telegraf");
const project_1 = global[Symbol.for('ioc.use')]("Config/project");
const utils_1 = require("../../utils");
const jsonToText = (json) => {
    const jsonString = JSON.stringify(json, null, 2);
    return `\`\`\`\n${jsonString}\n\`\`\``;
};
const errorMessage = ({ action, params, response, identifier, departureCode }) => {
    const paramsCode = jsonToText(params);
    const responseCode = jsonToText(response);
    const date = (0, utils_1.formattingDate)(new Date()).replace(".", ":");
    const kioskName = project_1.clientCredentials?.[identifier]?.[departureCode]?.name;
    let text = `Error Alert: ${action} \n`;
    text += `${kioskName} \n\n`;
    text += `Params \n${paramsCode}\n`;
    text += `Response \n${responseCode}`;
    text += date;
    return text;
};
const setPaidMessage = ({ action, params, response, identifier, departureCode, status }) => {
    const paramsCode = jsonToText(params);
    const responseCode = jsonToText(response);
    const date = (0, utils_1.formattingDate)(new Date()).replace(".", ":");
    const kioskName = project_1.clientCredentials?.[identifier]?.[departureCode]?.name;
    let text = `Setpaid Alert: ${status} \n`;
    text += `${kioskName} \n\n`;
    text += `Params \n${paramsCode}\n`;
    text += `Response \n${responseCode}`;
    text += date;
    return text;
};
const templateText = {
    error: (params) => errorMessage(params),
    setPaid: (params) => setPaidMessage(params)
};
const sendAlert = async (type, params) => {
    try {
        const telegramToken = Env_1.default.get('TELEGRAM_TOKEN');
        const teleGram = new telegraf_1.Telegram(telegramToken);
        const text = templateText[type](params);
        teleGram.sendMessage('-4105309504', text, { parse_mode: 'MarkdownV2' });
    }
    catch (error) {
        console.log('telegraf error', error);
    }
};
exports.sendAlert = sendAlert;
//# sourceMappingURL=Telegram.js.map