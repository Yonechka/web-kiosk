"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'add_url_identifier_field_to_access_client_tables';
    }
    async up() {
        this.schema.alterTable('access_clients', (table) => {
            table.string('url_identifier').nullable();
        });
    }
    async down() {
    }
}
exports.default = default_1;
//# sourceMappingURL=1704872486540_add_url_identifier_field_to_access_client_tables.js.map