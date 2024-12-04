import sharp from "sharp";

export class SharpHelper {
  static async lowerQuality(image: Buffer, name: string) {
    return await sharp(image).jpeg({ quality: 10 }).toFile(name);
  }
}
