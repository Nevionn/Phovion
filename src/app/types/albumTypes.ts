export type Album = {
  id: number;
  name: string;
  description: string | null;
  photoCount: number | null;
  coverPhotoId?: number | null; // обложка альбома
};

export type AlbumNaming = Pick<Album, "name" | "description">;

export type AlbumForViewPhotos = Pick<
  Album,
  "id" | "name" | "photoCount" | "description" | "coverPhotoId"
>;
