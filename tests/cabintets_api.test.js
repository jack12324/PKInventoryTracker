const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const originalUsers = helper.generateRandomUserData(50);
beforeAll(async () => {
  const promises = originalUsers.map((u) => new User(u).save());
  await Promise.all(promises);
}, 100000);

describe("When some cabinets and users already exist", () => {
  describe("Adding a new cabinet", () => {
    test.concurrent(
      "Succeeds with 201 and returns the added cabinet as json",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const newCabinet = {
          name: uuid(),
        };
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .set("Authorization", `Bearer ${token}`)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.name).toBe(newCabinet.name);
        expect(response.body.drawers).toHaveLength(0);

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });

        expect(addedCabinet.name).toBe(newCabinet.name);
        expect(addedCabinet.drawers).toHaveLength(0);
      }
    );
    test.concurrent(
      "with number of drawers specified Succeeds with 200 and returns the added cabinet as json",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const numDrawers = Math.floor(Math.random() * 5);
        const newCabinet = {
          name: uuid(),
          numDrawers,
        };
        const drawersBefore = await Drawer.find();
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .set("Authorization", `Bearer ${token}`)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.name).toBe(newCabinet.name);
        expect(response.body.drawers).toHaveLength(numDrawers);

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });

        expect(addedCabinet.name).toBe(newCabinet.name);
        expect(addedCabinet.drawers).toHaveLength(numDrawers);

        const drawersAfter = await Drawer.find();
        expect(drawersAfter).toHaveLength(drawersBefore.length + numDrawers);
      }
    );
    test.concurrent(
      "without a name fails with 400 and returns an error",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const newCabinet = {};
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("name is required for cabinet");

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });
        expect(addedCabinet).toBeNull();
      }
    );
    test.concurrent(
      "Without a token returns 400 and a valid error message",
      async () => {
        const newCabinet = {
          name: uuid(),
        };
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain(
          "authorization token missing from request"
        );

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });
        expect(addedCabinet).toBeNull();
      }
    );
    test.concurrent(
      "With a malformed token returns 400 and a valid error message",
      async () => {
        const newCabinet = {
          name: uuid(),
        };
        const token = "abadtokenwhichdoesntmakesense";
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("malformed token");

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });
        expect(addedCabinet).toBeNull();
      }
    );
    test.concurrent(
      "With a token for a deleted user returns 401 and a valid error message",
      async () => {
        const newCabinet = {
          name: uuid(),
        };
        const token = await helper.getInvalidToken();
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .set("Authorization", `Bearer ${token}`)
          .expect(401)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain(
          "user for provided token doesn't exist"
        );

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });
        expect(addedCabinet).toBeNull();
      }
    );
    test.concurrent(
      "With a non-admin token returns 401 and a valid error message",
      async () => {
        const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
        const newCabinet = {
          name: uuid(),
        };
        const response = await api
          .post("/api/cabinets")
          .send(newCabinet)
          .set("Authorization", `Bearer ${token}`)
          .expect(401)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("is not an admin");

        const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });
        expect(addedCabinet).toBeNull();
      }
    );
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
