import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('POST /app/register/test', () => {
    it('register an test app', async () => {
      const beforeCount = await prisma.applicationToken.count();
      const { status, body } = await request(app.getHttpServer())
        .post('/app/register/test')
        .send({ secret: 'fm3' });
      const afterCount = await prisma.applicationToken.count();

      expect(status).toBe(200);
      expect(body.appName).toBe('test');
      expect(body.token).toContain('fm3');
      expect(afterCount - beforeCount).toBe(1);
    });

    it('fails to register app for duplicate name', () => {
      return request(app.getHttpServer())
        .post('/app/register/test')
        .send({ secret: 'fm3' })
        .expect(409);
    });
  });

  it('POST /upload/image', () => {
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

  it('POST /upload/logo', () => {
    const fileName = 'test.png';
    const dest = process.env.LOGO_DEST ?? 'logos';
    const response = {
      originImage: `http://localhost:3000/${dest}/${fileName}`,
      compressImage: `http://localhost:3000/${dest}/compress/${fileName}`,
    };

    return request(app.getHttpServer())
      .post('/upload/logo')
      .attach('file', `./assets/${fileName}`)
      .expect(201)
      .expect(JSON.stringify(response, null));
  });
});
