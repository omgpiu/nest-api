import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { TopLevelCategory, TopPageModel } from "./top-page.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CreateTopPageDTO } from "./dto/create-top-page.dto";


@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
  }

  async create(dto: CreateTopPageDTO) {
    return this.topPageModel.create(dto);
  }


  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDTO) {
    return this.topPageModel.findByIdAndUpdate(id, dto, {
      new: true
    }).exec();
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();

  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();

  }

  async findAll() {
    return this.topPageModel.find({}).exec();

  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate()
      .match({ firstCategory })
      .group({
        _id: { secondCategory: "$secondCategory" },
        pages: { $push: { alias: "$alias", title: "$title" } }
      }).exec();
  }

//второй вариант записи
//   [
//     { $match: { firstCategory } },
// { $group: { _id: { secondCategory: "$secondCategory" }, pages: { $push: { alias: "$alias", title: "$title" } } }}
// ]

  async findByText(text: string) {
    return this.topPageModel.find({
      $text: { $search: text, $caseSensitive: false }
    }).exec();
  }
}
