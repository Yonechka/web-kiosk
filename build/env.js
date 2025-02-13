"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.default = Env_1.default.rules({
    HOST: Env_1.default.schema.string({ format: 'host' }),
    PORT: Env_1.default.schema.number(),
    APP_KEY: Env_1.default.schema.string(),
    APP_NAME: Env_1.default.schema.string(),
    APP_URL: Env_1.default.schema.string(),
    ASMAT_BASE_API_ENDPOINT: Env_1.default.schema.string(),
    CACHE_VIEWS: Env_1.default.schema.boolean(),
    SESSION_DRIVER: Env_1.default.schema.string(),
    DB_CONNECTION: Env_1.default.schema.string(),
    MYSQL_HOST: Env_1.default.schema.string({ format: 'host' }),
    MYSQL_PORT: Env_1.default.schema.number(),
    MYSQL_USER: Env_1.default.schema.string(),
    MYSQL_PASSWORD: Env_1.default.schema.string.optional(),
    MYSQL_DB_NAME: Env_1.default.schema.string(),
    DRIVE_DISK: Env_1.default.schema.enum(['local']),
    NODE_ENV: Env_1.default.schema.enum(['development', 'production', 'test']),
});
//# sourceMappingURL=env.js.map