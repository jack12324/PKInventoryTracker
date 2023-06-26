const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const existingUser = {
  username: uuid(),
  admin: Math.random() > 0.5,
  password: uuid(),
};
beforeAll(async () => {
  await helper.generateUser(existingUser);
}, 100000);

describe("When some users exist, logging in with", () => {
  test("valid credentials succeeds with 200, and returns a json payload with a token and a username", async () => {
    const credentials = {
      username: existingUser.username,
      password: existingUser.password,
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.username).toEqual(credentials.username);
  });

  test("a missing username returns 400 and error message", async () => {
    const credentials = {
      password: existingUser.password,
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toEqual("username is required");
  });
  test("a missing password returns 400 and error message", async () => {
    const credentials = {
      username: existingUser.username,
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toEqual("password is required");
  });
  test("an invalid password returns 422 and error message", async () => {
    const credentials = {
      username: existingUser.username,
      password: "wrongpassword",
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toEqual("invalid password");
  });
  test("a non-existing user returns 404 and error message", async () => {
    const removedUser = {
      username: uuid(),
      admin: Math.random() > 0.5,
      password: uuid(),
    };

    const savedUser = await helper.generateUser(removedUser);
    await savedUser.deleteOne();

    const credentials = {
      username: removedUser.username,
      password: removedUser.password,
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toEqual("user doesn't exist");
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
