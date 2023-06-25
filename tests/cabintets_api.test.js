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
beforeAll(async () => {
  const userPromises = originalUsers.map((u) => new User(u).save());
  await Promise.all(userPromises);
}, 100000);

describe("When some cabinets and users already exist", () => {
  describe("Adding a new cabinet", () => {
    test("Succeeds with 201 and returns the added cabinet as json", async () => {
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
    });
    test("with number of drawers specified Succeeds with 200 and returns the added cabinet as json", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const numDrawers = Math.floor(Math.random() * 5);
      const newCabinet = {
        name: uuid(),
        numDrawers,
      };
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

      const findDrawers = await Promise.all(
        addedCabinet.drawers.map((d) => Drawer.findById(d))
      );
      findDrawers.forEach((d) => {
        expect(d).toBeDefined();
      });
    });
    test("without a name fails with 400 and returns an error", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const newCabinet = {};
      const response = await api
        .post("/api/cabinets")
        .send(newCabinet)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("name is required");

      const addedCabinet = await Cabinet.findOne({ name: newCabinet.name });
      expect(addedCabinet).toBeNull();
    });
    test("Without a token returns 400 and a valid error message", async () => {
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
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
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
    });
    test("With a token for a deleted user returns 401 and a valid error message", async () => {
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
    });
    test("With a non-admin token returns 401 and a valid error message", async () => {
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
    });
  });
  describe("When deleting a cabinet", () => {
    test("Succeeds with 200, deletes cabinet and any drawers within the cabinet, and any items within those drawers", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const drawers = await Promise.all(
        cabinet.drawers.map((d) => Drawer.findById(d))
      );
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      await api
        .delete(`/api/cabinets/${cabinet.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const removedCabinet = await Cabinet.findOne({ name: cabinet.name });
      expect(removedCabinet).toBeNull();
      const foundDrawers = await Promise.all(
        cabinet.drawers.map((d) => Drawer.findById(d))
      );
      foundDrawers.forEach((d) => {
        expect(d).toBeNull();
      });

      const foundItems = await Promise.all(
        drawers.flatMap((d) => d.items.map((i) => Item.findById(i)))
      );
      foundItems.forEach((i) => expect(i).toBeNull());
    });
    test("Without a token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const response = await api
        .delete(`/api/cabinets/${cabinet.id}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const removedCabinet = await Cabinet.findOne({ name: cabinet.name });
      expect(removedCabinet.name).toBe(cabinet.name);
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .delete(`/api/cabinets/${cabinet.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const removedCabinet = await Cabinet.findOne({ name: cabinet.name });
      expect(removedCabinet.name).toBe(cabinet.name);
    });
    test("With a id that doesn't exist returns 404 and a valid error message", async () => {
      const id = await helper.getNonExistingCabinetId();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/cabinets/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("cabinet does not exist");
    });
    test("With a bad id returns 404 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/cabinets/lkjiejek`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for cabinet doesn't exist"
      );
    });
    test("With a non-admin token returns 401 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/cabinets/${cabinet.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const removedCabinet = await Cabinet.findOne({ name: cabinet.name });
      expect(removedCabinet.name).toBe(cabinet.name);
    });
  });
  describe("changing a cabinet's", () => {
    test("name succeeds with 200 and returns updated cabinet", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const newName = uuid();

      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .send({ name: newName })
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.name).toBe(newName);

      expect(response.body.name).toBe(newName);
    });
    test("nothing (empty payload) returns 200 and doesn't update anything", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.name).toBe(cabinet.name);

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.name).toBe(cabinet.name);
    });
    test("name with an empty name fails with 400 and doesn't update anything", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "" })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("name is required");

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.name).toBe(cabinet.name);
    });
    test("drawers returns 200 but doesn't actually update the drawers", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ drawers: [] })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.drawers).toHaveLength(cabinet.drawers.length);

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.drawers).toHaveLength(cabinet.drawers.length);
    });
    test("Without a token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const newName = uuid();
      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .send({ name: newName })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.name).toBe(cabinet.name);
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = "abadtokenwhichdoesntmakesense";
      const newName = uuid();

      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .send({ name: newName })
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.name).toBe(cabinet.name);
    });
    test("With a id that doesn't exist returns 404 and a valid error message", async () => {
      const id = await helper.getNonExistingCabinetId();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .put(`/api/cabinets/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("cabinet does not exist");
    });
    test("With a bad id returns 404 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .put(`/api/cabinets/lkjiejek`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for cabinet doesn't exist"
      );
    });
    test("With a non-admin token returns 401 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const cabinet = await helper.getRandomCabinetFrom(cabinets);
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const newName = uuid();

      const response = await api
        .put(`/api/cabinets/${cabinet._id}`)
        .send({ name: newName })
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const updatedCabinet = await Cabinet.findById(cabinet._id);
      expect(updatedCabinet.name).toBe(cabinet.name);
    });
  });
  describe("getting cabinets", () => {
    test("Without a token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const response = await api
        .get("/api/cabinets")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .get("/api/cabinets")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");
    });
    test("with an admin token succeeds with 200 and list of cabinets", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .get("/api/cabinets")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toBeDefined();

      response.body.forEach((c) => {
        expect(c.drawers).toBeDefined();
        expect(c.name).toBeDefined();
        expect(c.__v).toBeUndefined();
        expect(c._id).toBeUndefined();
        expect(c.id).toBeDefined();
      });

      const returnedCabinetNames = response.body.map((c) => c.name);
      cabinets.forEach((c) => {
        expect(returnedCabinetNames).toContain(c.name);
      });
    });
    test("With a non-admin token succeeds", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const response = await api
        .get("/api/cabinets")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toBeDefined();

      response.body.forEach((c) => {
        expect(c.drawers).toBeDefined();
        expect(c.name).toBeDefined();
        expect(c.__v).toBeUndefined();
        expect(c._id).toBeUndefined();
        expect(c.id).toBeDefined();
      });

      const returnedCabinetNames = response.body.map((c) => c.name);
      cabinets.forEach((c) => {
        expect(returnedCabinetNames).toContain(c.name);
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
