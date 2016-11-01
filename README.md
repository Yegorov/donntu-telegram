DonNTU Telegram
===============

## Описание

Граббер новостей для сайта университета [ДонНТУ](http://donntu.org/news). 
Предоставляет простой HTTP API для получения новостей и событий. 
На основе этого бекенда сделан бот для мессенджера Telegram.

## Особенности

* позволяет просматривать новости, события из сайта ДонНТУ.
* простой и не навязчивый дизайн сайта, выполненый в стиле Material. 
* реализован простой HTTP API.
* реализован бот для мессенджера Telegram.
* при обращении на сайт, API или к боту осуществляется запрос к *своей БД*,
т. е. данные будут доступны даже когда сайт ДонНТУ может не работать.
* добавление новостей производится по запросу на сайт с использованием HTTP Basic Authentication.
* легко разворачивается на облачной платформе (PaaS).

## Средства разработки (платформа, фреймворки, библиотеки)

В качестве платформы выбрана [`NodeJS`](https://nodejs.org/), которая основана 
на JS-движке V8 (на котором работает Chrome). Главная особенность NodeJS, это 
асинхронное API для работы с сетью и файловой системой.

В качестве веб-фреймворка, был выбран [`Express`](http://expressjs.com/) 
(гибкий, минималистичный фреймворк), 
шаблонизатор [`Pug` бывший (`Jade`)](https://pugjs.org), 
[`Bower`](https://bower.io/) для управления front-end зависимостями 

Стоит отметить следующие библиотеки:

* [`cheerio`](https://cheerio.js.org/) - предназначена для манипуляции с HTML (реализация jQuery для сервера)
* [`request`](https://github.com/request/request) - простой HTTP клиент
* [`sequelize`](http://docs.sequelizejs.com/en/v3/) - ORM для NodeJS, основана на [обещаниях](https://www.promisejs.org/), поддерживающая такие СУБД: PostgreSQL, MySQL, MariaDB, SQLite and MSSQL.
* [`moment`](http://momentjs.com/) - предназначена для манипуляции с датой
* [`telegram-bot-api`](https://github.com/mast/telegram-bot-api) - простая Promise-обертка над Telegram Bot API

и другие, которые находятся в файле `package.json`, в секциях dependencies, devDependencies.

### Почему JavaScript (NodeJS)?

Согласно рейтингу [Github](https://octoverse.github.com/), наиболее популярный 
язык программирования по количеству создаваемых проектов - JavaScript. 
Т. е. на сегодняшний день (ноябрь 2016) NodeJS с языком JavaScript являются 
самыми передовыми технологиями, которые определили сами разработчики Open Source 
сообщества. К тому же NodeJS используется обычно в стартапах.

Также хотелось закрепить опыт в: `JavaScript` (последний большой/реальный проект 
на этом языке был [`VKManager`](https://github.com/Yegorov/VKManager)), 
`асинхронном программировании`, проектированию `реляционной БД` и использование 
ее с помощью `асинхронной ORM` и конечно же разобраться в `Telegram Bot API` 
(в котором уже несколько раз 
[внесли новые изменения](https://core.telegram.org/bots/api-changelog))


## Развертывание проекта

Так как проект получился очень большой, что не является хорошой практикой и его
можно было бы разбить как минимум на три независимых проекта: граббер новостей, 
сайт для просмотра новостей с HTTP API и бот для Telegram. Но что сделано, то 
сделано и этим нужно как-то уметь пользоваться (даже через время и я могу забыть
все тонкости настройки).

При развертывании локально, естественно не будет работать бот, так как он использует
`webhooks` (события обновлений от Telegram), представленные в виде обычного 
POST-запроса на сайт. Почему? Как Telegram может отослать запрос на адрес 
`https://localhost/`? 

Тут две проблемы: 

* домен `localhost` нужно как-то подписать SSL-сертификатом (Telegram использует 
только HTTPS-соединение), но Telegram разрешает использовать [самоподписной 
сертификат](https://core.telegram.org/bots/api-changelog#august-29-2015)

* к домену `localhost` нельзя обратиться из Интернета. Он используется для обращения 
к самому себе (loopback).

При разработке в качестве СУБД использовалась SQLite (легковесная, встраиваемая 
СУБД). Это конечно является плюсом, так вам не нужно устанавливать MySQL-сервер.


### Развертывание проекта локально

1. Установите NodeJS (если он еще не установлен, иначе перейдите к пункту 3), 
скачайте его с [оф. сайта](https://nodejs.org/en/download/)

2. Откройте терминал (консоль) и введите такие команды для проверки 
(символ `$` - приглашение командной строки):

```
$ node -v
// тут будет написана версия NodeJS

$ npm -v
// тут будет написана версия NPM
```

Если будет сообщение об ошибки, например команда не найдена или что-то в этом роде,
то дальнейшие шаги выполнять бессмысленно. По гуглите эту проблему и после того 
как ее решите переходите на следующий шаг.

3. Склонируйте репозиторий или [скачайте архив с исходным кодом](https://github.com/Yegorov/donntu-telegram/archive/master.zip), 
если у вас не установлен Git и перейдите в корневой каталог проекта. 

```
$ git clone https://github.com/Yegorov/donntu-telegram.git
$ cd donntu-telegram
```

4. Установите все переменные окружения:

* для Windows: `$ set MY_ENV_VAR=value`
* для Linux: `$ export MY_ENV_VAR=value`

Приложение использует такие переменные окружения:

* `HOST`, по умолчанию: localhost
* `PORT`, по умолчанию: 3000
* `NODE_ENV`: по умолчанию: development
* `MYSQL_CONNECTION_STRING` (!) используется только при NODE_ENV=production (mysql://user:pass@host:port/db)
* `SECRET_UPDATE_PATH`, по умолчанию: updatedb
* `ADMIN_USERNAME` (!) для запуска граббера
* `ADMIN_PASSWORD` (!) для запуска граббера
* `TELEGRAM_BOT_TOKEN`, если не указано, то бот отключен

5. Установите все зависимости (фреймоворки, библиотеки, которые использует проект).
Для этого выполните команду:

```
$ npm install
// Ход установки
```

6. Запустите приложение. Для этого выполните команду:

```
$ npm start
// Вывод лога, например
// App launch on http://localhost:3000
```

7. Откройте браузер и перейдите по адресу, который будет написан в терминале.

8. Перейдите по адресу `http://localhost:3000/updatedb` для добавления новостей в БД.

Скриншоты приложения находятся [здесь](docs/app_img.md)

### Развертывание проекта на [Dokkur](https://dokkur.com/)

Dokkur – молодой PaaS из России (подробнее на [Хабре](https://habrahabr.ru/company/dokkur/blog/280870/)), 
достойная альтернатива [Heroku](https://www.heroku.com/).

Поддерживаемые языки:

* Ruby
* JavaScript (NodeJS)
* Clojure
* Python
* Java
* Scala
* PHP
* Go

Поддерживаемые БД:

* SQLite
* CouchDB
* Elasticsearch
* MariaDB
* Memcached
* Mongo
* MySQL
* Nats
* Postgres
* RabbitMQ
* Redis
* RethinkDB

На оф. сайте есть даже документация на [русском языке](https://dokkur.com/#!/documentation-ru/intro/common)

[Цены](https://dokkur.com/#!/pricing) на использование сравнительно нормальные.

Тариф `XS` подходит для начального развертывания проекта, имеет такие характеристики:

* 256 MB RAM
* 25% of 1 CPU Core
* 1 GB встроенной памяти SSD
* Безлимитный трафик
* Бесплатный SSL для домена yourapp.dokkurapp.com
* 1 бесплатная БД

Цена в месяц: 1$ ≈ 26 UAH ≈ 65 RUB. Бесплатных тарифов нет, но как сказали в тех. поддержки
блокировать аккаунт при отрицательном счете (до -100$) не будут.

Пошаговое описание развертывания приложения в PaaS Dokkur, можно 
найти [здесь](docs/dokkur_deploy.md)

## Описание структуры проекта и схема БД

### Структура проекта:

```
│   .gitignore
│   app.js
│   bower.json
│   LICENSE
│   package.json
│
├───api
│       index.js
│
├───config
│       config.json
├───docs
│   └───img
│       app_img.md
│       db_img.md
│       dokkur_deploy.md
│
├───grabber
│       additionToDB.js
│       index.js
│
├───migrations
│       20160926162914-create-news.js
│       20160926170033-create-tags.js
│       20160926170115-create-updates.js
│       20160926175643-create-tags-in-news.js
│       20161007213851-create-events.js
│
├───models
│       events.js
│       index.js
│       news.js
│       tags.js
│       tags_in_news.js
│       updates.js
│
├───public
│   ├───images
│   │       donntu-telegram.png
│   │
│   └───stylesheets
│           style.css
│
├───routes
│       apiV1.js
│       index.js
│       telegram.js
│
├───telegram
│       index.js
│
├───test
│       test.js
│
└───views
        error.pug
        index.pug
        layout.pug
        page.pug
```

### Схема БД:

![schema_db](docs/img/schema_db.png)

Больше изображений БД, можно найти [здесь](docs/db_img.md)

## Ссылки

* [Docs NodeJS](https://nodejs.org/en/docs/)
* [Docs NPM](https://docs.npmjs.com/getting-started/what-is-npm)
* [Node.js для начинающих](http://www.nodebeginner.ru/)
* [Node Hero - Getting Started With Node.js Tutorial](https://blog.risingstack.com/node-hero-tutorial-getting-started-with-node-js/)
* [A Beginner’s Guide to npm — the Node Package Manager](https://www.sitepoint.com/beginners-guide-node-package-manager/)
* [Promise](https://learn.javascript.ru/promise)
* [JavaScript Promises: an Introduction ](https://developers.google.com/web/fundamentals/getting-started/primers/promises)
* [«Грабим» с помощью Node.js](http://frontender.info/web-scraping-with-nodejs/)
* [Node, Postgres, and Sequelize](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WBh-yZfg7il)
* [Sequelize, the JavaScript ORM, in practice](http://www.redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html)
* [Creating An AngularJS Application With Sequelize – Part 1](https://scotch.io/tutorials/creating-an-angularjs-application-with-sequelize-part-1)
* [Docs Bower](https://bower.io/docs/creating-packages/)
* [Bower: зачем фронтенду нужен менеджер пакетов](http://nano.sapegin.ru/all/bower)
* [Bower — подробное руководство](http://loftblog.ru/material/bower-podrobnoe-rukovodstvo-1/)
* [How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f)

А также Telegram Bot API:

* [Bots: An introduction for developers](https://core.telegram.org/bots)
* [Telegram Bot API](https://core.telegram.org/bots/api)
* [Bots FAQ](https://core.telegram.org/bots/faq)

## Лицензия

Приложение распространяются по лицензии GPL.

Приложение поставляется по принципу "AS IS" ("как есть"). 
Вы используете данное программное обеспечение на свой страх и риск. 
Автор не несет ответственности за любой причененный вред данным приложением.


License (GPL) Copyright (c) 2016 Yegorov A.

## Сотрудничество и вопросы

Вы можете прислать Pull-request, если хотите внести свой вклад в проект.

Свои вопросы вы можете задать [здесь](https://github.com/yegorov/donntu-telegram/issues). 
Также можете написать свой вопрос на yegorov0725@yandex.ru