"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const mode = Env_1.default.get('NODE_ENV');
const customDomain = {
    'kruzz': mode === 'production' ? Env_1.default.get('API_DOMAIN_NAME') : Env_1.default.get('API_DOMAIN_NAME_TIKETUX'),
    'raputri': mode === 'production' ? Env_1.default.get('API_DOMAIN_NAME') : Env_1.default.get('API_DOMAIN_NAME_TIKETUX'),
    'jackal': mode === 'production' ? Env_1.default.get('API_DOMAIN_NAME') : Env_1.default.get('')
};
exports.default = customDomain;
//# sourceMappingURL=customDomain.js.map