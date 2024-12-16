"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
require("./api");
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('welcome');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('welcome');
    });
}).prefix('/jackal');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('daytrans');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('daytrans');
    });
}).prefix('/daytrans');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('baraya');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('baraya');
    });
}).prefix('/baraya');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('btm');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('btm');
    });
}).prefix('/btm');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('aragon');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('aragon');
    });
}).prefix('/aragon');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('kruzz');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('kruzz');
    });
}).prefix('/kruzz');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('connex');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('connex');
    });
}).prefix('/connex');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('raputri');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('raputri');
    });
}).prefix('/raputri');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('preview');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('preview');
    });
}).prefix('/preview');
Route_1.default.group(() => {
    Route_1.default.get('', async ({ view }) => {
        return view.render('cms');
    });
    Route_1.default.get('/*', async ({ view }) => {
        return view.render('cms');
    });
}).prefix('/cms');
Route_1.default.get('/show-session', async ({ session }) => {
    return session.all();
});
Route_1.default.get('/clear-session', async ({ session }) => {
    return session.clear();
});
//# sourceMappingURL=routes.js.map