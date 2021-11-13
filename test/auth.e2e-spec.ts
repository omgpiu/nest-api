import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { disconnect } from "mongoose";
import { AuthDto } from "../src/auth/dto/auth.dto";
import { PASSWORD_INCORRECT, USER_NOT_FOUND } from "../src/auth/auth.constans";

const loginForTest: AuthDto = {
  login: "a2@.ru",
  password: "1"
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();


  });

  it("/auth/login (POST) -success", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send(loginForTest)
      .expect(200).then(({ body }: request.Response) => {
        expect(body).toHaveProperty("access_token");
        expect(body.access_token).toBeDefined();

      });
  });

  it("/auth/login (POST) -fail email", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginForTest, login: "123@list.ru" })
      .expect(401, {
        "statusCode": 401,
        "message": USER_NOT_FOUND,
        "error": "Unauthorized"
      });

  });
  it("/auth/login  (POST) -fail password", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginForTest, password: "123" })
      .expect(401, {
        "statusCode": 401,
        "message": PASSWORD_INCORRECT,
        "error": "Unauthorized"
      });

  });
  afterAll(() => {
    disconnect();
  });
});
