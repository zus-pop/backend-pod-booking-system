export interface CloudStorage {
  letImageCookToCloud(
    imageFile: Express.Multer.File,
    folder: string,
  ): Promise<string>;
}
