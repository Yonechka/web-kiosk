"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    async up() {
        this.schema.alterTable('access_clients', (table) => {
            table.string('version_endpoint').defaultTo('asmat');
        });
    }
    async down() {
        this.schema.dropTable('access_client');
    }
}
exports.default = default_1;
//# sourceMappingURL=1687691530524_add_version_endpoint_field_to_client_access_tables.js.map