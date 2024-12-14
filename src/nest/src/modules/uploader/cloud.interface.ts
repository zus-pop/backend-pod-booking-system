export abstract class CloudStorage {
  abstract letImageCookToCloud(
    imageFile: Express.Multer.File,
    folder: string,
  ): Promise<string>;
}
