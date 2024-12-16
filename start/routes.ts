/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import './api'

Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('welcome')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('welcome')
  });
}).prefix('/jackal');


/* DAYTRANS */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('daytrans')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('daytrans')
  });
}).prefix('/daytrans');

/* BARAYA */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('baraya')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('baraya')
  });
}).prefix('/baraya');

/* BTM */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('btm')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('btm')
  });
}).prefix('/btm');

/* ARAGON */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('aragon')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('aragon')
  });
}).prefix('/aragon');

/* KRUZZ */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('kruzz')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('kruzz')
  });
}).prefix('/kruzz');

/* CONNEX */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('connex')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('connex')
  });
}).prefix('/connex');

/* RAPUTRI */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('raputri')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('raputri')
  });
}).prefix('/raputri');

/* PREVIEW */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('preview')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('preview')
  });
}).prefix('/preview');

/* CMS */
Route.group(() => {
  Route.get('', async ({ view }) => {
    return view.render('cms')
  });
  Route.get('/*', async ({ view }) => {
    return view.render('cms')
  });
}).prefix('/cms');


Route.get('/show-session', async ({ session }) => {
  return session.all();
});

Route.get('/clear-session', async ({ session }) => {
  return session.clear();
});
