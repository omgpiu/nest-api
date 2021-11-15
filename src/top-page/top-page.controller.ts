import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { TopPageService } from "./top-page.service";
import { CreateTopPageDTO } from "./dto/create-top-page.dto";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { TOP_PAGE_NOT_FOUND } from "./contants";
import { FindTopPageDto } from "./dto/find-top-page.dto";

@Controller("top-page")
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post("create")
  async create(@Body() dto: CreateTopPageDTO) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async get(@Param("id", IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);
    if (!page) throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    return page;
  }

  @UseGuards(JwtGuard)
  @Get("byAlias/:alias")
  async getByAlias(@Param("alias") alias: string) {
    const page = await this.topPageService.findByAlias(alias);
    if (!page) throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    return page;
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Get("textSearch/:text")
  async textSearch(@Param("text") text: string) {
    return await this.topPageService.findByText(text);
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async delete(@Param("id", IdValidationPipe) id: string) {
    const deleted = await this.topPageService.deleteById(id);
    if (!deleted) throw new NotFoundException(TOP_PAGE_NOT_FOUND);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  async patch(@Param("id", IdValidationPipe) id: string, @Body() dto: CreateTopPageDTO) {
    const updated = await this.topPageService.updateById(id, dto);
    if (!updated) throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    return updated;
  }

  @UseGuards(JwtGuard)
  @Post("find")
  async find(@Body() dto: FindTopPageDto) {
    return await this.topPageService.findByCategory(dto.firstCategory);
  }

}
