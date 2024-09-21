import { ImageType } from "@/types/image-types";
import { v2 as cloudinary } from "cloudinary";
import ErrorCreator from "./errorCreator";
import { StatusCodes } from "http-status-codes";

// Connecting to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/**
 * Uploads an image to Cloudinary.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object>} - Returns the uploaded image data (URL, public_id, etc.).
 */
export const uploadImage = async (file: File): Promise<ImageType> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "rexteria",
          },
          (error, result) => {
            if (error) {
              return reject(
                new ErrorCreator(StatusCodes.BAD_REQUEST, error.message),
              );
            }
            resolve({
              url: result?.secure_url,
              public_id: result?.public_id,
            });
          },
        )
        .end(buffer);
    });
  } catch (error) {
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to upload image`,
    );
  }
};

/**
 * Uploads multiple images to Cloudinary.
 * @param {File[]} files - An array of files to upload.
 * @returns {Promise<Object[]>} - Returns an array of uploaded image data.
 */
export const uploadMultipleImages = async (
  files: File[],
): Promise<ImageType[]> => {
  const FilesPromise = files.map((file) => uploadImage(file));
  const images = await Promise.all(FilesPromise);
  return images;
};

/**
 * Deletes an image from Cloudinary by public ID.
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<Object>} - Returns the result of the deletion.
 */
export const deleteImage = async (publicId: string): Promise<unknown> => {
  try {
    if (!publicId) {
      throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Public ID is required.");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new ErrorCreator(StatusCodes.NOT_FOUND, "Image not found.");
    }

    return result;
  } catch (error) {
    console.log(error);
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to delete image`,
    );
  }
};
