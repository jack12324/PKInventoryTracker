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
  test("Adding a user succeeds with 200 and returns added user as json", async () => {
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
    expect(response.body._id).toBeUndefined();
    expect(response.body.__v).toBeUndefined();
    expect(response.body.id).toBeDefined();

    const addedUser = await User.findOne({ userName: newUser.userName });
    expect(addedUser).toBeDefined();
    expect(addedUser.passwordHash).toBeDefined();
    expect(addedUser.passwordHash).not.toBe(newUser.password);
    expect(addedUser.admin).toBe(false);
  });
  test("Adding a user with the same username as an existing user fails with 400 and appropriate error message as json", async () => {});
  test("Adding a user with a username that is too short fails with 400 and appropriate error message as json", async () => {});
  test("Adding a user without a username fails with 400 and appropriate error message as json", async () => {});
  test("Adding a user with a password that is too short fails with 400 and appropriate error message as json", async () => {});
  test("Adding a user without a password fails with 400 and appropriate error message as json", async () => {});
  test("Adding a user with the admin field set to true overrides this value and sets it to false", async () => {});
});

afterAll(async () => {
  await Promise.all([User.deleteMany({}), mongoose.connection.close()]);
});
