import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/upload/image (POST)', () => {
    const fileName = 'test.png';
    const response = {
      originImage: `http://localhost:3000/uploads/${fileName}`,
      compressImage: `http://localhost:3000/uploads/compress/${fileName}`,
    };

    return request(app.getHttpServer())
      .post('/upload/image')
      .attach('file', `./assets/${fileName}`)
      .expect(201)
      .expect(JSON.stringify(response, null));
  });
});
