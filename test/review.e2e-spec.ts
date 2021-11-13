import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { CreateReviewDto } from "../src/review/dto/create-review.dto";
import { disconnect, Types } from "mongoose";
import { REVIEW_NOT_FOUND } from "../src/review/constants";
import { AuthDto } from "../src/auth/dto/auth.dto";

const loginForTest: AuthDto = {
  login: "a2@.ru",
  password: "1"
};


const productId = new Types.ObjectId().toHexString();
const randomId = new Types.ObjectId().toHexString();
const testDTO: CreateReviewDto = {
  name: "test",
  title: "Title Test",
  description: "Description",
  rating: 5,
  productId
};
describe("AppController (e2e)", () => {
  let app: INestApplication;
  let createdID: string;
  let token: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer()).post("/auth/login").send(loginForTest);

    token = body.access_token;

  });

  it("/review/create (POST) -success", async () => {
    return request(app.getHttpServer())
      .post("/review/create")
      .send(testDTO)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdID = body._id;
        expect(createdID).toBeDefined();
      });
  });

  it("/review/create (POST) -fail", async () => {
    return request(app.getHttpServer())
      .post("/review/create")
      .send({ ...testDTO, rating: 0 })
      .expect(400).then(({ body }: request.Response) => {
        console.log(body);
      });
  });

  it("/review/byProduct/:productId (GET)-success", async () => {
    return request(app.getHttpServer())
      .get("/review/byProduct/" + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });
  it("/review/byProduct/:productId (GET)", async () => {
    return request(app.getHttpServer())
      .get("/review/byProduct/" + randomId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });
  it("/review/:id (DELETE) -failed", () => {
    return request(app.getHttpServer())
      .delete("/review/" + randomId)
      .set("Authorization", "Bearer " + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND
      });
  });
  it("/review/:id (DELETE) -success", () => {
    return request(app.getHttpServer())
      .delete("/review/" + createdID)
      .set("Authorization", "Bearer " + token)
      .expect(200);
  });
  afterAll(() => {
    disconnect();
  });
});
