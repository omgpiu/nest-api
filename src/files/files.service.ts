import { Injectable } from "@nestjs/common";
import { format } from "date-fns";
import { path } from "app-root-path";
import { FileElementResponce } from "./dto/file-element.responce";
import { ensureDir, writeFile } from "fs-extra";
import * as sharp from "sharp";

@Injectable()
export class FilesService {

  async saveFiles(files: Express.Multer.File[]): Promise<FileElementResponce[]> {
    const dateFolder = format(new Date(), "yyyy-MM-dd");
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponce[] = [];
    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname });
    }
    return res;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

}
