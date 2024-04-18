import { db } from "../config/db.js";
import { ObjectId } from "mongodb";
import Products from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await Products.find({});

    return res.status(201).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const viewProduct = async (req, res) => {
  try {
    const result = await Products.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {

    const { name, category, price, stock } = req.body;

    if (!name || !category || !price || !stock) {
      return res.status(400).json({
        error: "Missing required fields. Please provide name, category, price, and stock.",
      });
    }

    let created_at = new Date();
    const productDetails = { ...req.body };

    const product = new Products({
      ...productDetails,
      created_at,
      latest_update: created_at,
    });
    await product.save();

    return res.status(201).json({
      message: "Product has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    let latest_update = new Date();

    req.body.latest_update = latest_update;
    const { _id, created_at, ...productBody } = req.body;

    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.set(productBody);
    product.latest_update = new Date();
    await product.save();


    return res.json({
      message: "Product has been updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {

    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();

    return res.json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
