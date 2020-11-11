require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
    let userId;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line
      userId = signInData.body.id;
      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('adds to todos', async () => {

      const expectation = {
        id: 4,
        name: 'wash your hands',
        priority: 1,
        completed: false,
        owner_id: userId
      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .set({ Authorization: token })
        .send(expectation)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

    });

    test('adds to todos', async () => {

      const expectation = {
        id: 5,
        name: 'comb your hair (if you have any)',
        priority: 3,
        completed: false,
        owner_id: userId
      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .set({ Authorization: token })
        .send(expectation)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

    });
    test('adds to todos', async () => {

      const expectation = {
        id: 6,
        name: 'call your mother',
        priority: 2,
        completed: false,
        owner_id: userId
      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .set({ Authorization: token })
        .send(expectation)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

    });


    test('tests .put / returns object', async () => {


      const expectation = {
        id: 6,
        name: 'call your mother',
        priority: 2,
        completed: true,
        owner_id: userId
      };

      const data = await fakeRequest(app)
        .put('/api/todos/?_id=6')
        .set({ Authorization: token })
        .send(expectation)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

    });
    test('returns todos', async () => {

      const expectation = [
        {
          id: 4,
          name: 'wash your hands',
          priority: 1,
          completed: false,
          owner_id: userId
        },
        {
          id: 6,
          name: 'call your mother',
          priority: 2,
          completed: true,
          owner_id: userId
        },
        {
          id: 5,
          name: 'comb your hair (if you have any)',
          priority: 3,
          completed: false,
          owner_id: userId
        }

      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set({ Authorization: token })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
