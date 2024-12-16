"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Supabase_1 = require("./Supabase");
const project_1 = global[Symbol.for('ioc.use')]("Config/project");
const logging = async ({ action, params, response, status, identifier, departureCode }) => {
    if (Env_1.default.get('NODE_ENV') != 'production')
        return;
    await Supabase_1.supabase
        .from('logs')
        .insert({
        kiosk_id: project_1.clientCredentials?.[identifier]?.[departureCode]?.outlet_id,
        outlet_kiosk: project_1.clientCredentials?.[identifier]?.[departureCode]?.name,
        params,
        response,
        action,
        status
    });
};
exports.default = logging;
//# sourceMappingURL=Logging.js.map