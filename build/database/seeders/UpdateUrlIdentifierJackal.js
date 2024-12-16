"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const AccessClient_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AccessClient"));
class default_1 extends Seeder_1.default {
    async run() {
        await AccessClient_1.default.updateOrCreate({
            client_id: 'JACKAL_HOLIDAYS',
        }, {
            url_identifier: 'jackal'
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=UpdateUrlIdentifierJackal.js.map