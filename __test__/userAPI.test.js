import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../config/serverConfig";
import userRoute from "../routes/userRoutes";
import Users from "../models/UserModel";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"

dotenv.config();

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = createServer();
  app.use("/api/test", userRoute);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Routes", () => {
  describe("POST /api/test/register", () => {
    it("should register new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        username: "testuser",
      };

      const response = await request(app).post("/api/test/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("User Registered Successful");

      const user = await Users.findOne({ email: "test@example.com" });
      expect(user).toBeTruthy();
      expect(user.username).toBe("testuser");
    });

    it("should not register because email already exists", async () => {
      await Users.create({
        email: "existing@example.com",
        password: await bcrypt.hash("password123", 10),
        username: "existinguser",
      });

      const userData = {
        email: "existing@example.com",
        password: "password123",
        username: "newuser",
      };

      const response = await request(app).post("/api/test/register").send(userData);

      expect(response.status).toBe(500);
      expect(response.body.msg).toBe("User already exists");
    });
  });

  describe("POST /api/test/login", () => {
    it("should login a user", async () => {

      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app).post("/api/test/login").send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("User logged in successfully");
      expect(response.body.token).toBeTruthy();
    });

    it("should not login because wrong password", async () => {

      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app).post("/api/test/login").send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Error login");
    });
  });
});