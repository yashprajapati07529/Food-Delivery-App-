import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import ejs from 'ejs'
import authMiddleware from './middleware/errorHandler.js'

import customerRoutes from "./routes/customerRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

dotenv.config()

const app = express();

app.use(cors({
  origin: '*'
}));

app.set('view engine' , 'ejs')

const PORT = process.env.PORT || 5000;

connectDB()

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/uploads' , express.static("uploads"))

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Food Delivery API is running",
  });
});

app.use("/api/customers", customerRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliverypartners", deliveryRoutes);

app.use(authMiddleware);


app.listen(PORT , (err) => {
    err ? console.log(err):console.log(`Server Start : http://localhost:${PORT}`);
})