"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const AccessClient_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AccessClient"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
class default_1 extends Seeder_1.default {
    async run() {
        const hashedSecret = await Hash_1.default.make('CONNEX_KIOSK');
        await AccessClient_1.default.createMany([
            {
                client_id: 'CONNEX',
                client_secret: hashedSecret,
                url_identifier: 'connex',
                version_endpoint: 'asmatNew'
            }
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=AddConnexAccessClient.js.map