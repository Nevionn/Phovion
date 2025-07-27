## Структура проекта

```js
SORT-PHOTOS/
├── prisma/
│   ├── dev.db
│   └── schema.prisma
│
├── public/
│   └── uploads/ - Хранилище добавленных изображений
│
├── src/
│   ├── app/
│   │   ├── album\[id]/
│   │   │   ├── components/ - Компоненты страницы выбранного альбома
│   │   │   │   ├── Description.tsx
│   │   │   │   ├── DropZoneDragging.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── PhotoGrid.tsx
│   │   │   │   ├── SkeletonLoader.tsx
│   │   │   │   ├── SortablePhoto.tsx
│   │   │   │   ├── UploadSection.tsx
│   │   │   │   └── modals/
│   │   │   │       └── PhotoViewer.tsx
│   │   │   │       └── RenameAlbumModal.tsx
│   │   │   │       └── MovePhotoModal.tsx
│   │   │   ├── type/
│   │   │   │   └── photoTypes.ts
│   │   │   ├── utils/
│   │   │   │   └── utils.ts
│   │   │   ├── hooks/
│   │   │   │   └── useAlbumData.ts
│   │   │   │   └── useDeleteAlbum.ts
│   │   │   │   └── useRenameAlbum.ts
│   │   │   └── page.tsx - Страница выбранного альбома (галерея фотографий)
│   │   ├── api/
│   │   │   ├── albums/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts - Эндпоинт для получения и удаления выбранного альбома и всех его фотографий, переименование альбома, методы GET & DELETE & PUT
│   │   │   │   ├── count/
│   │   │   │   │   └── route.ts - Эндпоинт для поучения количества всех альбомов, метод GET
│   │   │   │   ├── cover/
│   │   │   │   │   └── cover.ts - Эндпоинт для установки новой обложки для альбома, метод PATCH
│   │   │   │   ├── create/
│   │   │   │   │   └── route.ts - Эндпоинт для создания нового альбома, метод POST
│   │   │   │   ├── deleteAll/
│   │   │   │   │   └── route.ts - Эндпоинт для удаления всех альбомов и их содержимого, метод DELETE
│   │   │   │   ├── reorder/
│   │   │   │   │   └── route.ts - Эндпоинт для сортировки альбомов путём dnd, метод POST
│   │   │   │   └── take/
│   │   │   │       └── route.ts - Эндпоинт для получения всех альбомов на главной странице(в качестве обложки устанавливается последняя картинка), метод GET
│   │   │   ├── dirSize/
│   │   │   │   └── route.ts - Эндпоинт для подсчета веса директории uploads, метод GET
│   │   │   ├── photos/
│   │   │   │   ├── count/
│   │   │   │   │   └── route.ts - Эндпоинт для поучения количества всех фотографий, метод GET
│   │   │   │   ├── countByAlbum/
│   │   │   │   │   └── route.ts - Эндпоинт для получения количества фотографий в альбоме (счётчик)
│   │   │   │   ├── delete/
│   │   │   │   │   └── route.ts - Эндпоинт для удаления выбраной фотографии, метод DELETE
│   │   │   │   ├── reorder/
│   │   │   │   │   └── route.ts - Эндпоинт для сортировки фотографий внутри альбома путём dnd, метод POST
│   │   │   │   └── upload/
│   │   │   │       └── route.ts - Эндпоинт для загрузки фотографий в локальную папку, и созадние записей о ней в бд
│   │   │   └── proxy/
│   │   │       └── route.ts - Эндпоинт для получения файла от внешнего ресурса, для дальнейшей обработки (межвкладочный трансфер), метод GET
│   │   │
│   │   ├── shared/ - Переиспользуемые глобальные компоненты
│   │   │   ├── buttons/
│   │   │   │   ├── CyberButton.tsx
│   │   │   │   ├── cyber-button.css
│   │   │   │   └── BackToTopButton.tsx
│   │   │   └── separator/
│   │   │       └── Separator.tsx
│   │   │
│   │   └── components/ - Компоненты главной страницы (списка альбомов)
│   │       ├── AlbumsControls.tsx
│   │       ├── AlbumsGrid.tsx
│   │       ├── AlbumsListContainer.tsx
│   │       └── modals/
│   │           └── CreateAlbumModal.tsx
├── types
│   └── albumTypes.ts
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx - Основная страница (список альбомов)
```
