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
    test("Succeeds with 201 and returns the added drawer as json", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const drawerCabinet = await helper.getRandomCabinetFrom(originalCabinets);
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

      expect(response.body.name).toEqual(newDrawer.name);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.cabinet).toEqual(drawerCabinet._id.toString());
      expect(response.body._id).toBeUndefined();
      expect(response.body.__v).toBeUndefined();
      expect(response.body.id).toBeDefined();

      const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
      expect(addedDrawer.name).toEqual(newDrawer.name);

      const cabinet = await Cabinet.findById(addedDrawer.cabinet);
      expect(cabinet).toBeDefined();
      expect(cabinet.drawers).toContainEqual(addedDrawer._id);
    });
    test("without a cabinet fails with 400 and returns an error", async () => {
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
    });
    test("with a cabinet that doesn't exist fails with 400 and returns an error", async () => {
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
    });
    test("without a position fails with 400 and returns an error", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const drawerCabinet = await helper.getRandomCabinetFrom(originalCabinets);
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
    });
    test("Without a token returns 401 and a valid error message", async () => {
      const newDrawer = {
        name: uuid(),
      };
      const response = await api
        .post("/api/drawers")
        .send(newDrawer)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
      expect(addedDrawer).toBeNull();
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
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

      const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
      expect(addedDrawer).toBeNull();
    });
    test("With a token for a deleted user returns 404 and a valid error message", async () => {
      const newDrawer = {
        name: uuid(),
      };
      const token = await helper.getInvalidToken();
      const response = await api
        .post("/api/drawers")
        .send(newDrawer)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "user for provided token doesn't exist"
      );

      const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
      expect(addedDrawer).toBeNull();
    });
    test("With a non-admin token returns 403 and a valid error message", async () => {
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const newDrawer = {
        name: uuid(),
      };
      const response = await api
        .post("/api/drawers")
        .send(newDrawer)
        .set("Authorization", `Bearer ${token}`)
        .expect(403)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const addedDrawer = await Drawer.findOne({ name: newDrawer.name });
      expect(addedDrawer).toBeNull();
    });
  });
  describe("When deleting a cabinet", () => {
    test("Succeeds with 200, deletes drawer and any items within drawer, removes drawer from cabinet", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
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
    });
    test("Without a token returns 401 and a valid error message", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const response = await api
        .delete(`/api/drawers/${drawer.id}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const removedDrawer = await Drawer.findById(drawer._id);
      expect(removedDrawer).toBeDefined();
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .delete(`/api/drawers/${drawer.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const removedDrawer = await Drawer.findById(drawer._id);
      expect(removedDrawer).toBeDefined();
    });
    test("With a id that doesn't exist returns 404 and a valid error message", async () => {
      const id = await helper.getNonExistingDrawerId();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/drawers/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("drawer does not exist");
    });
    test("With a bad id returns 404 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/drawers/lkjiejek`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for drawer doesn't exist"
      );
    });
    test("With a non-admin token returns 403 and a valid error message", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/drawers/${drawer.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const removedDrawer = await Drawer.findById(drawer._id);
      expect(removedDrawer).toBeDefined();
    });
  });
  describe("changing a drawer's", () => {
    test("position and name succeeds with 200 and returns updated drawer", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const newName = uuid();
      const newPosition = 398;

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .send({ name: newName, position: newPosition })
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.name).toEqual(newName);
      expect(updatedDrawer.position).toEqual(newPosition);
      expect(updatedDrawer.cabinet).toEqual(drawer.cabinet);
      expect(updatedDrawer.items).toEqual(drawer.items);

      expect(response.body.name).toEqual(newName);
      expect(response.body.position).toEqual(newPosition);
      expect(response.body.cabinet).toEqual(drawer.cabinet.toString());
      expect(response.body.items.toString()).toEqual(drawer.items.toString());
    });
    test("cabinet succeeds with 200, updates the relevant cabinets, and returns updated drawer", async () => {
      const cabinets = helper.generateRandomCabinetData(2, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const drawer = await helper.getRandomDrawerFromCabinets([cabinets[0]]);
      const toCabinet = await Cabinet.findOne({ name: cabinets[1].name });

      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .send({ cabinet: toCabinet._id })
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.cabinet).toEqual(toCabinet._id.toString());

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.name).toEqual(drawer.name);
      expect(updatedDrawer.position).toEqual(drawer.position);
      expect(updatedDrawer.cabinet).toEqual(toCabinet._id);
      expect(updatedDrawer.items).toEqual(drawer.items);

      const fromCabinet = await Cabinet.findById(drawer.cabinet);
      expect(fromCabinet.drawers).not.toContainEqual(drawer._id);

      const toCabinetUpdated = await Cabinet.findById(toCabinet._id);
      expect(toCabinetUpdated.drawers).toContainEqual(drawer._id);
    });
    test("nothing (empty payload) returns 200 and doesn't update anything", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.name).toEqual(drawer.name);

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.name).toEqual(drawer.name);
      expect(updatedDrawer.position).toEqual(drawer.position);
    });
    test("position with an invalid value fails with 400 and doesn't update anything", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ position: "ha" })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("position must be a number");

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.position).toEqual(drawer.position);
    });
    test("cabinet with an empty value fails with 404 and doesn't update anything", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ cabinet: "" })
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for cabinet doesn't exist"
      );

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.cabinet).toEqual(drawer.cabinet);
    });
    test("cabinet with an nonexisting value fails with 400 and doesn't update anything", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const nonExistingCabinet = await helper.getNonExistingCabinetId();

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ cabinet: nonExistingCabinet })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        `provided cabinet: ${nonExistingCabinet} doesn't exist`
      );

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.cabinet).toEqual(updatedDrawer.cabinet);
    });
    test("items returns 200 but doesn't actually update the items", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ items: [] })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.items).toHaveLength(drawer.items.length);

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.items).toHaveLength(drawer.items.length);
    });
    test("Without a token returns 401 and a valid error message", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .send({ position: 390 })
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.position).toEqual(drawer.position);
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .send({ position: 390 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.position).toEqual(drawer.position);
    });
    test("With a id that doesn't exist returns 404 and a valid error message", async () => {
      const id = await helper.getNonExistingDrawerId();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .put(`/api/drawers/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("drawer does not exist");
    });
    test("With a bad id returns 404 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .put(`/api/drawers/lkjiejek`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for drawer doesn't exist"
      );
    });
    test("With a non-admin token returns 403 and a valid error message", async () => {
      const drawer = await helper.setupAndGetDrawerForTest();
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/drawers/${drawer._id}`)
        .send({ position: 390 })
        .set("Authorization", `Bearer ${token}`)
        .expect(403)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const updatedDrawer = await Drawer.findById(drawer._id);
      expect(updatedDrawer.position).toEqual(drawer.position);
    });
  });
  describe("getting drawers", () => {
    test("Without a token returns 401 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const response = await api
        .get("/api/drawers")
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .get("/api/drawers")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");
    });
    test("with an admin token succeeds with 200 and list of drawers", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const addedCabinets = await Promise.all(
        cabinets.map((c) => Cabinet.findOne({ name: c.name }))
      );
      const drawers = await Promise.all(
        addedCabinets.flatMap((c) => c.drawers.map((d) => Drawer.findById(d)))
      );

      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .get("/api/drawers")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toBeDefined();

      response.body.forEach((c) => {
        expect(c.items).toBeDefined();
        expect(c.name).toBeDefined();
        expect(c.position).toBeDefined();
        expect(c.__v).toBeUndefined();
        expect(c._id).toBeUndefined();
        expect(c.id).toBeDefined();
      });

      const returnedDrawerIds = response.body.map((d) => d.id);
      drawers.forEach((d) => {
        expect(returnedDrawerIds).toContainEqual(d._id.toString());
      });
    });
    test("With a non-admin token succeeds", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const addedCabinets = await Promise.all(
        cabinets.map((c) => Cabinet.findOne({ name: c.name }))
      );
      const drawers = await Promise.all(
        addedCabinets.flatMap((c) => c.drawers.map((d) => Drawer.findById(d)))
      );
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const response = await api
        .get("/api/drawers")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toBeDefined();

      response.body.forEach((c) => {
        expect(c.items).toBeDefined();
        expect(c.name).toBeDefined();
        expect(c.position).toBeDefined();
        expect(c.__v).toBeUndefined();
        expect(c._id).toBeUndefined();
        expect(c.id).toBeDefined();
      });

      const returnedDrawerIds = response.body.map((d) => d.id);
      drawers.forEach((d) => {
        expect(returnedDrawerIds).toContainEqual(d._id.toString());
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
