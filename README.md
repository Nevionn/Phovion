# Phovion

<div align="center"> <img src="./preview/phovion-preview.webp"> </div>
<br>

Локальное веб-приложение, разработанное для создания и управления альбомами с фотографиями. Phovion работает прямо в браузере, не требуя серверной инфраструктуры.

# Скриншоты

<!-- <div align="center" style="display: flex; align-items: center;">
  <img src="./preview/handle-drop.webp" alt="1" width="200" height="200">
  <img src="./preview/settings-modal.webp" alt="2" width="200" height="200">
  <img src="./preview/page-pick-album.webp" alt="3" width="200" height="200">
  <img src="./preview/photo-picker.webp" alt="4" width="200" height="200">
</div> -->

# Особенности

- Создание альбомов: Легко создавайте и управляйте альбомами для организации ваших фотографий.
- Загрузка фотографий: Добавляйте изображения, включая GIF, прямо через интерфейс или перетаскиванием из других вкладок.
- Сортировка Drag-and-Drop: Интуитивная сортировка альбомов и фотографий с помощью перетаскивания (DND).
- Управляйте интерфейсом клавишами.
- Поддержка GIF: Полная совместимость с анимированными изображениями.
- Кастомизация: Выберите цветовую тему, чтобы настроить внешний вид под свои предпочтения.
- Скачивание: Экспортируйте фотографии из альбома на свой компьютер.

# Стек технологий

<div align="center" style="display: flex; align-items: center;">
  <img src="https://cdn.simpleicons.org/nextdotjs/000?width=40" alt="Next.js Logo" width="100" height="100" style="fill:#000000" />
  <span style="margin: 0 10px; font-size: 24px;"> </span>
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TS Logo" width="100" height="100">
  <span style="margin: 0 10px; font-size: 24px;"> </span>
  <img src="https://cdn.simpleicons.org/prisma" width="100" height="100" alt="Prisma icon"/>
  <span style="margin: 0 10px; font-size: 24px;"> </span>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/SQLite370.svg/2560px-SQLite370.svg.png" alt="SQlite Logo" width="100" height="100">
  <span style="margin: 0 10px; font-size: 24px;"> </span>
  <img src="https://raw.githubusercontent.com/emotion-js/emotion/main/emotion.png" alt="emotion.js" width="100" height="100">
  <span style="margin: 0 10px; font-size: 24px;"> </span>
</div>

# Особенности сборки

Приложение работает в dev моде, связано это с особенностями работы директории public в next.js в dev и production режимах ([подробнее читать обсуждение](https://github.com/vercel/next.js/discussions/18005))

- Для разработчиков: Если вы хотите попробовать режим production, после добавления новых фото нужно перекомпилировать проект командой npm run build и запустить npm run start. Но для обычного использования достаточно npm run dev.
- Где хранятся фото: Все ваши изображения сохраняются в папке public/uploads на компьютере. Эта папка не затрагивается обновлениями, если вы её не удаляете.
- Удаление изображений происходит из интерфейса приложения, не удаляйте файл напрямую из папки public/uploads !

# Конфиденциальность

Приложение полностью локальное, и работает только на вашем компьютере.
Приложение не собирает и не передает никакие ваши данные или фотографии в интернет. Всё, что вы создаёте — альбомы, фото и настройки, — остаётся исключительно у вас.

# Сборка из исходников

## Структура проекта

- [Структура](https://github.com/Nevionn/Phovion/blob/master/StructureProject.md)

## Зависимости

- Node.js: v18.x или выше ([Установить](https://nodejs.org/en))
- Git ([Установить](https://git-scm.com/downloads/win))

### Первичная сборка

```bash
git clone https://github.com/Nevionn/Phovion.git

cd phovion

npm install

npx prisma db push

npx prisma generate

npm run dev

ctrl + http://localhost:3000
```

### Последующий запуск приложения

```bash
npm run dev

или запустить start-dev.bat
```

## Получение обновлений 📦

```bash
git pull
```

Если вы совершали локальные изменения в коде, при обновление нужно будет разрешить локальные конфликты файлов

## ССЫЛКИ ❤️

[<img src="https://gitlab.com/prolinux410/owl_dots/-/raw/main/.img/git_tg.png?ref_type=heads" width="100">](https://t.me/ancient_nevionn)
[<img src="https://gitlab.com/prolinux410/owl_dots/-/raw/main/.img/git_coffee.png?ref_type=heads" width="100">](https://www.donationalerts.com/r/nevion)
