const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const Cabinet = require("../models/cabinet");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const originalUsers = helper.generateRandomUserData(50);
beforeAll(async () => {
  const promises = originalUsers.map((u) => new User(u).save());
  await Promise.all(promises);
});

describe("When some cabinets and users already exist", () => {
  describe("Adding a new cabinet", () => {
    test.concurrent(
      "Succeeds with 200 and returns the added cabinet as json",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        console.log(token);
        const newCabinet = {
          name: uuid(),
        };
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(response.body.name).toBe(newCabinet.name);
        expect(response.body.drawers).toHaveLength(0);

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });

        expect(addedCabinet.name).toBe(newCabinet.name);
        expect(addedCabinet.drawers).toHaveLength(0);
      }
    );
    test.concurrent(
      "Without a token returns 401 and a valid error message",
      async () => {}
    );
    test.concurrent(
      "With a bad token returns 401 and a valid error message",
      async () => {}
    );
    test.concurrent(
      "With a non-admin token returns 401 and a valid error message",
      async () => {}
    );
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
