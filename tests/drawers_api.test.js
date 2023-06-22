const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const Cabinet = require("../models/cabinet");
const Drawer = require("../models/drawer");
const Item = require("../models/item");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const originalUsers = helper.generateRandomUserData(50);
const originalCabinets = helper.generateRandomCabinetData(10);
beforeAll(async () => {
  const userPromises = originalUsers.map((u) => new User(u).save());
  const cabinetPromises = originalCabinets.map((c) => new Cabinet(c).save());
  await Promise.all([...userPromises, ...cabinetPromises]);
}, 100000);

describe("When some cabinets, drawers, and users already exist", () => {
  describe("Adding a new drawer", () => {
    test.concurrent(
      "Succeeds with 201 and returns the added drawer as json",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const drawerCabinet = await helper.getRandomCabinetFrom(
          originalCabinets
        );
        const newDrawer = {
          name: uuid(),
          position: Math.floor(Math.random() * 5),
          cabinet: drawerCabinet._id,
        };
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.name).toBe(newDrawer.name);
        expect(response.body.items).toHaveLength(0);
        expect(response.body.cabinet).toBe(drawerCabinet._id.toString());
        expect(response.body._id).toBeUndefined();
        expect(response.body.__v).toBeUndefined();
        expect(response.body.id).toBeDefined();

        const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
        expect(addedDrawer.name).toBe(newDrawer.name);

        const cabinet = await Cabinet.findById(addedDrawer.cabinet);
        expect(cabinet).toBeDefined();
        expect(cabinet.drawers).toContainEqual(addedDrawer._id);
      }
    );
    test.concurrent(
      "without a cabinet fails with 400 and returns an error",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const newDrawer = {
          name: uuid(),
          position: Math.floor(Math.random() * 5),
        };
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("cabinet is required");

        const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
    test.concurrent(
      "with a cabinet that doesn't exist fails with 400 and returns an error",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const drawerCabinet = await helper.getNonExistingCabinetId();
        const newDrawer = {
          name: uuid(),
          position: Math.floor(Math.random() * 5),
          cabinet: drawerCabinet,
        };
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("given cabinet does not exist");

        const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
    test.concurrent(
      "without a position fails with 400 and returns an error",
      async () => {
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const drawerCabinet = await helper.getRandomCabinetFrom(
          originalCabinets
        );
        const newDrawer = {
          name: uuid(),
          cabinet: drawerCabinet._id,
        };
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("position is required");

        const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
    test.concurrent(
      "Without a token returns 400 and a valid error message",
      async () => {
        const newDrawer = {
          name: uuid(),
        };
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain(
          "authorization token missing from request"
        );

        const addedDrawer = await Cabinet.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
    test.concurrent(
      "With a malformed token returns 400 and a valid error message",
      async () => {
        const newDrawer = {
          name: uuid(),
        };
        const token = "abadtokenwhichdoesntmakesense";
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("malformed token");

        const addedDrawer = await Cabinet.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
    test.concurrent(
      "With a token for a deleted user returns 401 and a valid error message",
      async () => {
        const newDrawer = {
          name: uuid(),
        };
        const token = await helper.getInvalidToken();
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(401)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain(
          "user for provided token doesn't exist"
        );

        const addedDrawer = await Cabinet.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
    test.concurrent(
      "With a non-admin token returns 401 and a valid error message",
      async () => {
        const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
        const newDrawer = {
          name: uuid(),
        };
        const response = await api
          .post("/api/drawers")
          .send(newDrawer)
          .set("Authorization", `Bearer ${token}`)
          .expect(401)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("is not an admin");

        const addedDrawer = await Cabinet.findOne({ name: newDrawer.name });
        expect(addedDrawer).toBeNull();
      }
    );
  });
  describe("When deleting a cabinet", () => {
    test.concurrent(
      "Succeeds with 200, deletes drawer and any items within drawer, removes drawer from cabinet",
      async () => {
        const cabinets = helper.generateRandomCabinetData(5, 1);
        await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
        const drawer = await helper.getRandomDrawerFromCabinets(cabinets);
        const token = await helper.getRandomAdminTokenFrom(originalUsers);

        await api
          .delete(`/api/drawers/${drawer.id}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        const removedDrawer = await Drawer.findById(drawer._id);
        expect(removedDrawer).toBeNull();
        const foundItems = await Promise.all(
          drawer.items.map((i) => Item.findById(i))
        );
        foundItems.forEach((i) => {
          expect(i).toBeNull();
        });
        const cabinet = await Cabinet.findById(drawer.cabinet);
        expect(cabinet.drawers).not.toContainEqual(drawer._id);
      }
    );
    test.concurrent(
      "Without a token returns 400 and a valid error message",
      async () => {
        const cabinets = helper.generateRandomCabinetData(5, 1);
        await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
        const drawer = await helper.getRandomDrawerFromCabinets(cabinets);
        const response = await api
          .delete(`/api/drawers/${drawer.id}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain(
          "authorization token missing from request"
        );

        const removedDrawer = await Drawer.findById(drawer._id);
        expect(removedDrawer).toBeDefined();
      }
    );
    test.concurrent(
      "With a malformed token returns 400 and a valid error message",
      async () => {
        const cabinets = helper.generateRandomCabinetData(5, 1);
        await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
        const drawer = await helper.getRandomDrawerFromCabinets(cabinets);
        const token = "abadtokenwhichdoesntmakesense";

        const response = await api
          .delete(`/api/drawers/${drawer.id}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("malformed token");

        const removedDrawer = await Drawer.findById(drawer._id);
        expect(removedDrawer).toBeDefined();
      }
    );
    test.concurrent(
      "With a id that doesn't exist returns 404 and a valid error message",
      async () => {
        const id = await helper.getNonExistingDrawerId();
        const token = await helper.getRandomAdminTokenFrom(originalUsers);
        const response = await api
          .delete(`/api/drawers/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(404)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("drawer does not exist");
      }
    );
    test.concurrent(
      "With a non-admin token returns 401 and a valid error message",
      async () => {
        const cabinets = helper.generateRandomCabinetData(5, 1);
        await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
        const drawer = await helper.getRandomDrawerFromCabinets(cabinets);
        const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
        const response = await api
          .delete(`/api/drawers/${drawer.id}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(401)
          .expect("Content-Type", /application\/json/);

        expect(response.body.error).toContain("is not an admin");

        const removedDrawer = await Drawer.findById(drawer._id);
        expect(removedDrawer).toBeDefined();
      }
    );
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
