import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../config/serverConfig";
import productsRoute from "../routes/productsRoutes";
import Products from "../models/productModel";
import generateToken from "../utils/generateToken";
import dotenv from "dotenv"

dotenv.config();

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = createServer();
  app.use("/api/test", productsRoute);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Product Routes", () => {
  const authToken = generateToken("testId")
  const invalidToken = "invalid-token-123"

  describe("GET /api/test/getAll", () => {
    it("should return all products", async () => {
      const product1 = { name: "Product 1", category: "Category 1", price: 10, stock: 100 };
      const product2 = { name: "Product 2", category: "Category 2", price: 20, stock: 200 };

      await Products.create(product1);
      await Products.create(product2);

      const response = await request(app).get("/api/test/getAll");

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe("Product 1");
      expect(response.body.data[1].name).toBe("Product 2");
    });
  });

  describe("POST /api/test/add", () => {
    it("should create a new product", async () => {
      const newProduct = {
        name: "New Product",
        category: "New Category",
        price: 30,
        stock: 300
      };

      const response = await request(app).post("/api/test/add").set("Authorization", `Bearer ${authToken}`).send(newProduct);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product has been created successfully");

      const savedProduct = await Products.findOne({ name: "New Product" });
      expect(savedProduct).toBeTruthy();
      expect(savedProduct.category).toBe("New Category");
      expect(savedProduct.price).toBe(30);
      expect(savedProduct.stock).toBe(300);
    });

    it("should return 401 because token is invalid", async () => {
      const newProduct = {
        name: "New Product",
        category: "New Category",
        price: 30,
        stock: 300
      };

      const response = await request(app)
        .post("/api/test/add")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(newProduct);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 401 because token is missing", async () => {
      const newProduct = {
        name: "New Product",
        category: "New Category",
        price: 30,
        stock: 300
      };

      const response = await request(app)
        .post("/api/test/add")
        .send(newProduct);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token is missing");
    });
  });

  describe("PUT /api/test/edit/:id", () => {
    it("should update product details", async () => {
      const existingProduct = await Products.create({
        name: "Existing Product",
        category: "Existing Category",
        price: 40,
        stock: 400
      });

      const updatedProduct = {
        name: "Updated Product",
        category: "Updated Category",
        price: 50,
        stock: 500
      };

      const response = await request(app).put(`/api/test/edit/${existingProduct._id}`).set("Authorization", `Bearer ${authToken}`).send(updatedProduct);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product has been updated successfully");

      const updatedProductInDB = await Products.findById(existingProduct._id);
      expect(updatedProductInDB.name).toBe("Updated Product");
      expect(updatedProductInDB.category).toBe("Updated Category");
      expect(updatedProductInDB.price).toBe(50);
      expect(updatedProductInDB.stock).toBe(500);
    });

    it("should return 401 because token is invalid", async () => {
      const existingProduct = await Products.create({
        name: "Existing Product",
        category: "Existing Category",
        price: 40,
        stock: 400
      });

      const updatedProduct = {
        name: "Updated Product",
        category: "Updated Category",
        price: 50,
        stock: 500
      };

      const response = await request(app)
        .put(`/api/test/edit/${existingProduct._id}`)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(updatedProduct);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 401 because token is missing", async () => {
      const existingProduct = await Products.create({
        name: "Existing Product",
        category: "Existing Category",
        price: 40,
        stock: 400
      });

      const updatedProduct = {
        name: "Updated Product",
        category: "Updated Category",
        price: 50,
        stock: 500
      };

      const response = await request(app)
        .put(`/api/test/edit/${existingProduct._id}`)
        .send(updatedProduct);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token is missing");
    });
  });

  describe("DELETE /api/test/remove/:id", () => {
    it("should delete product", async () => {
      const existingProduct = await Products.create({
        name: "Product to delete",
        category: "Category to delete",
        price: 60,
        stock: 600
      });

      const response = await request(app).delete(`/api/test/remove/${existingProduct._id}`).set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product has been deleted successfully");

      const deletedProduct = await Products.findById(existingProduct._id);
      expect(deletedProduct).toBeNull();
    });

    it("should return 401 because token is invalid", async () => {
      const existingProduct = await Products.create({
        name: "Product to delete",
        category: "Category to delete",
        price: 60,
        stock: 600
      });

      const response = await request(app)
        .delete(`/api/test/remove/${existingProduct._id}`)
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 401 because token is missing", async () => {
      const existingProduct = await Products.create({
        name: "Product to delete",
        category: "Category to delete",
        price: 60,
        stock: 600
      });

      const response = await request(app)
        .delete(`/api/test/remove/${existingProduct._id}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token is missing");
    });
  });
});
