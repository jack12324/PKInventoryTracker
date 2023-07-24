const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const existingAdminUser = {
  username: uuid(),
  admin: true,
  password: uuid(),
};
const existingUser = {
  username: uuid(),
  admin: false,
  password: uuid(),
};
beforeAll(async () => {
  await helper.generateUser(existingAdminUser);
  await helper.generateUser(existingUser);
}, 100000);

describe("When some users exist", () => {
  describe("loggin in with", () => {
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
  describe("Checking token", () => {
    test("Without a token returns 401 and a valid error message", async () => {
      const response = await api
        .get("/api/login")
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .get("/api/login")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");
    });
    test("With a expired token returns 401 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(
        [existingUser, existingAdminUser],
        0
      );

      const response = await api
        .get("/api/login")
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("token expired");
    });
    test("with an admin token succeeds with 200", async () => {
      const token = await helper.getRandomAdminTokenFrom([
        existingUser,
        existingAdminUser,
      ]);
      await api
        .get("/api/login")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
    test("with a non admin token succeeds with 200", async () => {
      const token = await helper.getRandomNonAdminTokenFrom([
        existingUser,
        existingAdminUser,
      ]);
      await api
        .get("/api/login")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
