"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const mode = Env_1.default.get('NODE_ENV');
const customSubdomain = {
    'jackal': mode === 'production' ? 'https://stg.' : 'https://dev.',
    'jackalx': mode === 'production' ? 'https://stg.' : 'https://dev.'
};
exports.default = customSubdomain;
//# sourceMappingURL=customSubdomain.js.map