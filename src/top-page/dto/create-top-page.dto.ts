import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TopLevelCategory } from "../top-page.model";
import { Type } from "class-transformer";


class TopPageAdvantageDTO {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

class HhDataDTO {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class CreateTopPageDTO {
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsOptional()
  @ValidateNested()
  @Type(() => HhDataDTO)
  hh?: HhDataDTO;


  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantageDTO)
  advantages: TopPageAdvantageDTO[];

  @IsString()
  alias: string;

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsString()
  secondCategory: string;

  @IsString()
  title: string;

  @IsString()
  category: string;


}
