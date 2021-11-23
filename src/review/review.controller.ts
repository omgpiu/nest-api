import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { REVIEW_NOT_FOUND } from "./constants";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { UserEmailDecorator } from "../decorators/user.email.decorator";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { TelegramService } from "../telegram/telegram.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService,
              private readonly telegramService: TelegramService) {
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post("create")
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);

  }

  @UsePipes(new ValidationPipe())
  @Post("notify")
  async notify(@Body() dto: CreateReviewDto) {
    const message = `Имя: ${dto.name}\n` + `Заголовок: ${dto.title}\n` + `Описание: ${dto.description}\n` + `Рейтинг: ${dto.rating}\n` + `ID product: ${dto.productId}`;
    return this.telegramService.sendMessage(message);

  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async delete(@Param("id", IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) throw  new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtGuard)
  @Get("byProduct/:productId")
  async getByProduct(@Param("productId", IdValidationPipe) productId: string, @UserEmailDecorator() email: string) {
    //userEmailDecorator забирает email  с запроса
    return this.reviewService.findByProductId(productId);

  }


}
