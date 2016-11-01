Развертывание приложения в Dokkur
=================================

## Переходим по адресу [`https://dokkur.com`](https://dokkur.com)

![1_dokkur](img/1_dokkur.PNG)

## Переходим в раздел `Personal apps` и создаем новое приложение

![2_dokkur](img/2_dokkur.PNG)

## Вводим название приложения и выбираем `Instance` на котором будет развернуто приложение, нажимаем на кнопку `CREATE APP`

![3_dokkur](img/3_dokkur.PNG)

![4_dokkur](img/4_dokkur.PNG)

## Переходим во вкладку SSL

По умолчанию нет никакого сертификата (впринципе сайт будет работать по HTTP, 
но бот Telegram принимает запросы только по HTTPS). Или сбрасываем сертификат 
по умолчанию, или переходим по адресу: `https://youapp.dokkurapp.com`,
результат должен получится как на 2-ом изображении.

![5_dokkur](img/5_dokkur.PNG)

![5.1_dokkur](img/5.1_dokkur.PNG)

## На вкладке `Databases` создаем новую БД и привязываем ее к приложению

![6_dokkur](img/6_dokkur.PNG)

![6.1_dokkur](img/6.1_dokkur.PNG)

## Переходи на вкладку `Settings`, запоминаем `Git URL` и вводим переменные окружения

![7_dokkur](img/7_dokkur.PNG)

![7.1_dokkur](img/7.1_dokkur.PNG)

## Открываем консоль, клонируем репозиторий, заходим в корневой каталог и добавляем удаленный репозиторий (`Git URL`) в git

```
$ git clone https://github.com/Yegorov/donntu-telegram.git
$ cd donntu-telegram
$ git remote add dokkur GIT_URL
```

## Отправляем на сервер Dokkur это приложение

```
$ git push dokkur master
// Ход развертывания приложения
```
