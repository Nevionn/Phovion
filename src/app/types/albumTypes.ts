export type Album = {
  id: number;
  name: string;
  description: string | null;
  avatar: string | null;
  photoCount: number | null;
};

export type AlbumNaming = Pick<Album, "name" | "description">;
