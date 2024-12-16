"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecordsOlderThan = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const supabaseUrl = 'https://cuumqqqqgotmzoljajtk.supabase.co';
const supabaseKey = Env_1.default.get('SUPABASE_KEY');
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const deleteRecordsOlderThan = async ({ tableName, dateColumn, olderThan = 7 }) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - olderThan)).toISOString();
    const { data, error } = await exports.supabase
        .from(tableName)
        .delete()
        .lt(dateColumn, sevenDaysAgo);
    if (error) {
        console.error('Error deleting records:', error);
    }
    else {
        console.log('Records deleted:', data);
    }
};
exports.deleteRecordsOlderThan = deleteRecordsOlderThan;
//# sourceMappingURL=Supabase.js.map