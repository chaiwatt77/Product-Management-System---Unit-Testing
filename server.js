import { connectDb } from "./config/db.js";
import cors from "cors";
import productsRouter from "./routes/productsRoutes.js";
import createServer from "./config/serverConfig.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv"

dotenv.config();


connectDb()

const app = createServer();

app.use(cors());

app.use('/api/products', productsRouter)
app.use('/api/user', userRouter)

const PORT = 3000;

app.listen(PORT, console.log(`Server Run at port ${PORT}`));
