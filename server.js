// файл server.js нужен для старта сервера на node.js heroku
// название файла может быть любым (главное его потом прописать в package.json, где start:prod)

// код пишется на JavaScript
// данный файл никак не связан с кодом в папке src - этот файл нужен только для запуска сервера node.js, куда затем будет установлено само приложение


// импорт сторонних библиотек (будут подключены в папку node_modules, т.к. в файле package.json указан "type": "module",
import * as https from "https"; // чтобы выполнять запрос по https
import express from 'express'; // используем более легковесный сервер express https://www.geeksforgeeks.org/node-js-vs-express-js/#:~:text=js%3A-,Node.,a%20framework%20based%20on%20Node.
import proxy from 'http-proxy-middleware'; // для создания прокси сервера
import path from 'path'; // для путей к скомпилированным файлам
import fs from 'fs';

const app = express(); // создаем объект express для настройки и старта

// хостинг (веб контейнер), где находится  backend
const backendUrl = 'https://localhost:8443/platform-1.0.1'; // здесь должен быть фактический адрес контейнера


const rootPath = path.resolve(); // путь до папки, где будет расположен проект в heroku
const appName = 'platformui'; // должно совпадать с названием проекта



// по-умолчанию не будут разрешены запросы из сторонних сайтов, т.к. не включена библиотека cors - т.е. только пользователь из браузера сможет обратиться

// основная причина исп-я прокси - это отправка браузером куков в запросы на backend
// при установке на Heroku - домены клиента и сервера отличаются (не localhost), поэтому браузер не будет отправлять куки из-за параметра Strict


var myLogger = function (req, res, next) {
  console.log(req.urlRoot);
  console.log(req.url);
  console.log(req.urlAfterRedirects);
  next();
};
app.use(myLogger);
// путь до скомпилированных файлов в папке dist - все входящие запросы будут направляться именно в эту папку
app.use(express.static(rootPath + '/dist/' + appName)); // название берется из файла package.json, поле name

// проверяем все входящие запросы
// app.get('*', function (req, res, next) {
//   if (req.headers['x-forwarded-proto'] != 'https') // если запрос не содержит https
//     res.redirect(backendUrl + req.url) // тогда явно перебросить на https
//   else
//     next() // иначе продолжить запрос (значит уже содержит https)
// })

// все запросы направляем в папку dist
app.get('/*', function (req, res) {
  const fullPath = path.join(rootPath + '/dist/' + appName + '/index.html');
  res.sendFile(fullPath);
})
app.use('/api', proxy.createProxyMiddleware({
  target: backendUrl, // куда будет перенаправлен запрос
  changeOrigin: false, // изменить параметр origin - откуда приходит запрос - будет убрано слово "api"
  secure: false, // только по каналу нttps, если self-signed сертифика, то надо отключить.
  logLevel: "debug",
  withCredentials: true, // отправлять кук (т.к. это решает уже не браузер, то куки будут отправлены)
  pathRewrite: { // удалить слово api из url
    "^/api/": ""
  }
}));

// для проверки и локального запуска ---------------------------------------------

const options = {
  key: fs.readFileSync(rootPath + '/dist/' + appName + '/assets/ssl/osptpp_ssl_ostptt_rootca_.key'),
  cert: fs.readFileSync(rootPath + '/dist/' + appName + '/assets/ssl/osptpp_ssl_ostptt_rootca_.cer')
};
const appServer = https.createServer(options, app);
// const appServer = https.createServer(app);

const port = 3333;

// запуск сервера - нужно закомментировать строки ниже "запуск сервер на heroku"
appServer.listen(port, () => console.log(`App running on: https://localhost:${port} root: '${rootPath}`));

// ---------------------------------------------


// запуск сервера на heroku
// const server = app.listen(process.env.PORT || 8080, function () {
//   const port = server.address().port;
//   console.log("App now running on port", port);
// });


