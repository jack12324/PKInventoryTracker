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
const originalCabinets = helper.generateRandomCabinetData(10, 1);
beforeAll(async () => {
  const userPromises = originalUsers.map((u) => new User(u).save());
  const cabinetPromises = originalCabinets.map((c) =>
    helper.populateCabinet(c)
  );
  await Promise.all([...userPromises, ...cabinetPromises]);
}, 100000);

describe("When some cabinets, drawers, and users already exist", () => {
  describe("Adding a new item", () => {
    test("Succeeds with 201 and returns the added drawer as json", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const drawer = await helper.getRandomDrawerFromCabinets(originalCabinets);
      const newItem = {
        name: uuid(),
        drawer: drawer._id,
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.name).toEqual(newItem.name);
      expect(response.body.drawer).toEqual(drawer._id.toString());
      expect(response.body._id).toBeUndefined();
      expect(response.body.__v).toBeUndefined();
      expect(response.body.id).toBeDefined();

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem.name).toEqual(newItem.name);

      const dbDrawer = await Drawer.findById(addedItem.drawer);
      expect(dbDrawer).toBeDefined();
      expect(dbDrawer.items).toContainEqual(addedItem._id);
    });
    test("without a drawer fails with 400 and returns an error", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const newItem = {
        name: uuid(),
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("drawer is required");

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("with a drawer that doesn't exist fails with 404 and returns an error", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const drawerId = await helper.getNonExistingDrawerId();
      const newItem = {
        name: uuid(),
        drawer: drawerId,
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("given drawer does not exist");

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("with a drawer id which doesn't make sense fails with 404 and returns an error", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const drawerId = "someidthatisn'tright";
      const newItem = {
        name: uuid(),
        drawer: drawerId,
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for drawer doesn't exist"
      );

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("without a name fails with 400 and returns an error", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const drawer = await helper.getRandomDrawerFromCabinets(originalCabinets);
      const newItem = {
        drawer: drawer._id,
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("name is required");

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("Without a token returns 401 and a valid error message", async () => {
      const newItem = {
        name: uuid(),
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const newItem = {
        name: uuid(),
      };
      const token = "abadtokenwhichdoesntmakesense";
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("With a token for a deleted user returns 404 and a valid error message", async () => {
      const newItem = {
        name: uuid(),
      };
      const token = await helper.getInvalidToken();
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "user for provided token doesn't exist"
      );

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("With a non-admin token returns 403 and a valid error message", async () => {
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const newItem = {
        name: uuid(),
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(403)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
    test("With a expired token returns 401 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers, 0);
      const newItem = {
        name: uuid(),
      };
      const response = await api
        .post("/api/items")
        .send(newItem)
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("token expired");

      const addedItem = await Item.findOne({ name: newItem.name });
      expect(addedItem).toBeNull();
    });
  });
  describe("When deleting an item", () => {
    test("Succeeds with 200, deletes item and removes item from drawer", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      await api
        .delete(`/api/items/${item.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const removedItem = await Item.findById(item._id);
      expect(removedItem).toBeNull();

      const drawer = await Drawer.findById(item.drawer);
      expect(drawer.items).not.toContainEqual(item._id);
    });
    test("Without a token returns 401 and a valid error message", async () => {
      const drawer = await helper.setupAndGetItemForTest();
      const response = await api
        .delete(`/api/items/${drawer.id}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const removedItem = await Item.findById(drawer._id);
      expect(removedItem).toBeDefined();
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const drawer = await helper.setupAndGetItemForTest();
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .delete(`/api/items/${drawer.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const removedItem = await Item.findById(drawer._id);
      expect(removedItem).toBeDefined();
    });
    test("With a id that doesn't exist returns 404 and a valid error message", async () => {
      const id = await helper.getNonExistingItemId();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/items/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        `item with id ${id} does not exist`
      );
    });
    test("With a bad id returns 404 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/items/idkedk`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for item doesn't exist"
      );
    });
    test("With a non-admin token returns 403 and a valid error message", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const response = await api
        .delete(`/api/items/${item.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const removedItem = await Item.findById(item._id);
      expect(removedItem).toBeDefined();
    });
    test("With a expired token returns 401 and a valid error message", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers, 0);
      const response = await api
        .delete(`/api/items/${item.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("token expired");

      const removedItem = await Item.findById(item._id);
      expect(removedItem).toBeDefined();
    });
  });
  describe("changing an item's", () => {
    test("name succeeds with 200 and returns updated drawer", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const newName = uuid();

      const response = await api
        .put(`/api/items/${item._id}`)
        .send({ name: newName })
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(newName);
      expect(updatedItem.drawer).toEqual(item.drawer);

      expect(response.body.name).toEqual(newName);
      expect(response.body.drawer).toEqual(item.drawer.toString());
    });
    test("drawer succeeds with 200, updates the relevant drawers, and returns updated drawer", async () => {
      const cabinets = helper.generateRandomCabinetData(2, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const fromDrawer = await helper.getRandomDrawerFromCabinets([
        cabinets[0],
      ]);
      const toDrawer = await helper.getRandomDrawerFromCabinets([cabinets[1]]);

      const item = await Item.findById(fromDrawer.items[0]);

      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/items/${item._id}`)
        .send({ drawer: toDrawer._id })
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.drawer).toEqual(toDrawer._id.toString());

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(item.name);
      expect(updatedItem.drawer).toEqual(toDrawer._id);

      const fromDrawerAfter = await Drawer.findById(fromDrawer._id);
      expect(fromDrawerAfter.items).not.toContainEqual(item._id);

      const toDrawerAfter = await Drawer.findById(toDrawer._id);
      expect(toDrawerAfter.items).toContainEqual(item._id);
    });
    test("nothing (empty payload) returns 200 and doesn't update anything", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/items/${item._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.name).toEqual(item.name);

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(item.name);
      expect(updatedItem.drawer).toEqual(item.drawer);
    });
    test("drawer with an empty value fails with 404 and doesn't update anything", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/items/${item._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ drawer: "" })
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for drawer doesn't exist"
      );

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.drawer).toEqual(item.drawer);
    });
    test("drawer with an nonexisting value fails with 404 and doesn't update anything", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const nonExistingDrawer = await helper.getNonExistingDrawerId();

      const response = await api
        .put(`/api/items/${item._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ drawer: nonExistingDrawer })
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        `provided drawer: ${nonExistingDrawer} doesn't exist`
      );

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.drawer).toEqual(updatedItem.drawer);
    });
    test("Without a token returns 401 and a valid error message", async () => {
      const item = await helper.setupAndGetItemForTest();
      const response = await api
        .put(`/api/items/${item._id}`)
        .send({ name: uuid() })
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "authorization token missing from request"
      );

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(item.name);
    });
    test("With a malformed token returns 400 and a valid error message", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = "abadtokenwhichdoesntmakesense";

      const response = await api
        .put(`/api/items/${item._id}`)
        .send({ name: uuid() })
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(item.name);
    });
    test("With a id that doesn't exist returns 404 and a valid error message", async () => {
      const id = await helper.getNonExistingItemId();
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .put(`/api/items/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        `item with id: ${id} doesn't exist`
      );
    });
    test("With a bad id returns 404 and a valid error message", async () => {
      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .put(`/api/items/lkjiejek`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain(
        "provided objectId for item doesn't exist"
      );
    });
    test("With a non-admin token returns 403 and a valid error message", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);

      const response = await api
        .put(`/api/items/${item._id}`)
        .send({ name: uuid() })
        .set("Authorization", `Bearer ${token}`)
        .expect(403)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("is not an admin");

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(item.name);
    });
    test("With a expired token returns 401 and a valid error message", async () => {
      const item = await helper.setupAndGetItemForTest();
      const token = await helper.getRandomAdminTokenFrom(originalUsers, 0);

      const response = await api
        .put(`/api/items/${item._id}`)
        .send({ name: uuid() })
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("token expired");

      const updatedItem = await Item.findById(item._id);
      expect(updatedItem.name).toEqual(item.name);
    });
  });
  describe("getting items", () => {
    test("Without a token returns 401 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const response = await api
        .get("/api/items")
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
        .get("/api/items")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("malformed token");
    });
    test("With a expired token returns 401 and a valid error message", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));
      const token = await helper.getRandomAdminTokenFrom(originalUsers, 0);

      const response = await api
        .get("/api/items")
        .set("Authorization", `Bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toContain("token expired");
    });
    test("with an admin token succeeds with 200 and list of items", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const addedCabinets = await Promise.all(
        cabinets.map((c) => Cabinet.findOne({ name: c.name }))
      );
      const drawers = await Promise.all(
        addedCabinets.flatMap((c) => c.drawers.map((d) => Drawer.findById(d)))
      );
      const items = await Promise.all(
        drawers.flatMap((d) => d.items.map((i) => Item.findById(i)))
      );

      const token = await helper.getRandomAdminTokenFrom(originalUsers);
      const response = await api
        .get("/api/items")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toBeDefined();

      response.body.forEach((i) => {
        expect(i.name).toBeDefined();
        expect(i.drawer).toBeDefined();
        expect(i.__v).toBeUndefined();
        expect(i._id).toBeUndefined();
        expect(i.id).toBeDefined();
      });

      const returnedItemIds = response.body.map((i) => i.id);
      items.forEach((i) => {
        expect(returnedItemIds).toContainEqual(i._id.toString());
      });
    });
    test("with a non admin token succeeds with 200 and list of items", async () => {
      const cabinets = helper.generateRandomCabinetData(5, 1);
      await Promise.all(cabinets.map((c) => helper.populateCabinet(c)));

      const addedCabinets = await Promise.all(
        cabinets.map((c) => Cabinet.findOne({ name: c.name }))
      );
      const drawers = await Promise.all(
        addedCabinets.flatMap((c) => c.drawers.map((d) => Drawer.findById(d)))
      );
      const items = await Promise.all(
        drawers.flatMap((d) => d.items.map((i) => Item.findById(i)))
      );

      const token = await helper.getRandomNonAdminTokenFrom(originalUsers);
      const response = await api
        .get("/api/items")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toBeDefined();

      response.body.forEach((i) => {
        expect(i.name).toBeDefined();
        expect(i.drawer).toBeDefined();
        expect(i.__v).toBeUndefined();
        expect(i._id).toBeUndefined();
        expect(i.id).toBeDefined();
      });

      const returnedItemIds = response.body.map((i) => i.id);
      items.forEach((i) => {
        expect(returnedItemIds).toContainEqual(i._id.toString());
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
