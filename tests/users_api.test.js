const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

beforeAll(async () => {
  const generateUser = () => ({
    userName: uuid(),
    passwordHash: uuid(),
    admin: Math.random() > 0.5,
  });

  const saveRandomUser = () => {
    const newUser = new User(generateUser());
    return newUser.save();
  };

  const promises = Array.from(new Array(100), () => saveRandomUser());
  await Promise.all(promises);
});

describe("When some users already exist", () => {
  test.concurrent(
    "Adding a user succeeds with 200 and returns added user as json",
    async () => {
      const newUser = {
        userName: uuid(),
        password: uuid(),
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.userName).toBe(newUser.userName);
      expect(response.body.password).toBeUndefined();
      expect(response.body.passwordHash).toBeUndefined();
      expect(response.body.admin).toBe(false);
      expect(response.body._id).toBeUndefined();
      expect(response.body.__v).toBeUndefined();
      expect(response.body.id).toBeDefined();

      const addedUser = await User.findOne({ userName: newUser.userName });
      expect(addedUser).toBeDefined();
      expect(addedUser.passwordHash).toBeDefined();
      expect(addedUser.passwordHash).not.toBe(newUser.password);
      expect(addedUser.admin).toBe(false);
    }
  );
  test.concurrent(
    "Adding a user with the same username as an existing user fails with 400 and appropriate error message as json",
    async () => {
      const allUsers = await User.find({});
      const existingUser =
        allUsers[Math.floor(Math.random() * allUsers.length)];

      const newUser = {
        userName: existingUser.userName,
        password: uuid(),
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe("username must be unique");
    }
  );
  test.concurrent(
    "Adding a user with a username that is too short fails with 400 and appropriate error message as json",
    async () => {
      const newUser = {
        userName: uuid().slice(0, 4),
        password: uuid(),
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe(
        "username must be at least 5 characters"
      );
    }
  );
  test.concurrent(
    "Adding a user without a username fails with 400 and appropriate error message as json",
    async () => {
      const newUser = {
        password: uuid(),
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe("username is required");
    }
  );
  test.concurrent(
    "Adding a user with a password that is too short fails with 400 and appropriate error message as json",
    async () => {
      const newUser = {
        userName: uuid(),
        password: uuid().slice(0, 7),
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe(
        "password must be at least 8 characters"
      );
    }
  );
  test.concurrent(
    "Adding a user without a password fails with 400 and appropriate error message as json",
    async () => {
      const newUser = {
        userName: uuid(),
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe("password is required");
    }
  );
  test.concurrent(
    "Adding a user with the admin field set to true overrides this value and sets it to false",
    async () => {
      const newUser = {
        userName: uuid(),
        password: uuid(),
        admin: true,
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.userName).toBe(newUser.userName);
      expect(response.body.admin).toBe(false);

      const addedUser = await User.findOne({ userName: newUser.userName });
      expect(addedUser).toBeDefined();
      expect(addedUser.admin).toBe(false);
    }
  );
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});