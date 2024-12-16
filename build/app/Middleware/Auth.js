"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpContext_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HttpContext"));
class AuthMiddleware {
    constructor() {
        this.redirectTo = '/login';
    }
    async authenticate(auth, guards) {
        const ctx = HttpContext_1.default.get();
        let guardLastAttempted;
        guardLastAttempted;
        for (let guard of guards) {
            guardLastAttempted = guard;
            if (await auth.use(guard).check()) {
                auth.defaultGuard = guard;
                return true;
            }
        }
        ctx?.response.status(401).send('Unauthorized');
    }
    async handle({ auth }, next, customGuards) {
        const guards = customGuards.length ? customGuards : [auth.name];
        await this.authenticate(auth, guards);
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map