import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export interface TopPageModel extends Base {

}

export class TopPageAdvantage {
  @prop()
  title: string;
  @prop()
  description: string;
}

export class HhData {
  @prop()
  count: number;
  @prop()
  juniorSalary: number;
  @prop()
  middleSalary: number;
  @prop()
  seniorSalary: number;
}

export class TopPageModel extends TimeStamps {
  @prop({ type: () => [String] })
  tags: string[];

  @prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @prop({ type: () => HhData })
  hh?: HhData;

  @prop({ type: () => [TopPageAdvantage] })
  advantages: TopPageAdvantage[];

  @prop({ unique: true })
  alias: string;

  @prop()
  seoText: string;

  @prop()
  tagsTitle: string;

  @prop()
  secondCategory: string;

  @prop()
  title: string;

  @prop()
  category: string;


}
