import sharp from "sharp";

export class SharpHelper {
  /**
   * Reduces the quality of the given image (Buffer) to 10% and saves it as a
   * JPEG file with the given name.
   *
   * @param {Buffer} image The image to be processed.
   * @param {string} name The name of the output file.
   * @returns {Promise<void>} A promise that resolves when the image has been
   * processed and saved.
   */
  static async lowerQuality(image: Buffer, name: string) {
    return await sharp(image).jpeg({ quality: 10 }).toFile(name);
  }
}
