import { Storage } from "@google-cloud/storage";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({
    storage,
});

const gc = new Storage({
    // My Google Cloud Storage credentials
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID as string,
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL as string,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
        ),
    },
});
const bucket = gc.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME as string);

export const letImageCookToCloud = async (imageFile: Express.Multer.File) => {
    const baseImageUrl = "https://storage.googleapis.com";
    return new Promise<string>((resolve, reject) => {
        if (!imageFile) {
            reject(new Error("No image file provided"));
        }

        const blob = bucket.file(imageFile.originalname.replace(/[\s-]/g, "_"));
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on("error", (err) => {
            reject("Error uploading go Google Cloud Storage" + err);
        });

        blobStream.on("finish", () => {
            const publicUrl = `${baseImageUrl}/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.end(imageFile.buffer);
    });
};
