import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ProductModel } from "./product.model";
import { FindProductDto } from "./dto/find-product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { PRODUCT_NOT_FOUND } from "./constants";
import { JwtGuard } from "../auth/guard/jwt.guard";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @UseGuards(JwtGuard)
  @Post("create")
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);

  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async get(@Param("id") id: string): Promise<ProductModel> {
    const product = await this.productService.findById(id);
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);
    return product;
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    const deletedProd = await this.productService.deleteById(id);
    if (!deletedProd) throw  new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  async patch(@Param("id") id: string, @Body() dto: ProductModel) {
    const updatedPro = await this.productService.updateById(id, dto);
    if (!updatedPro) throw  new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return updatedPro;
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("find")
  async find(@Body() dto: FindProductDto) {
    const product = await this.productService.findWIthReviews(dto);
    if (!product) throw  new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return product;
  }
}
