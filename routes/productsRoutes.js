import { addProduct,getAllProducts,removeProduct,viewProduct,editProduct } from "../controllers/productsController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { Router } from "express";
const productsRouter = Router();

productsRouter.get('/getAll', getAllProducts)
productsRouter.get('/viewProduct/:id', viewProduct)
productsRouter.put('/edit/:id', isLoggedIn,  editProduct)
productsRouter.post('/add', isLoggedIn, addProduct)
productsRouter.delete('/remove/:id', isLoggedIn,  removeProduct)

export default productsRouter;
