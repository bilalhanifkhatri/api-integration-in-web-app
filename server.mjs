import express from "express";
import path from "path";
import mongoose from "mongoose";

const app = express();
// for body because body is in encrypted form thats why we parse it.
app.use(express.json());
const port = process.env.PORT || 5001;

let productSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: Number,
  catagory: String,
  description: String,
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);

app.post("/product", () => {
  const body = req.body;
  if (!body.name || !body.price || !body.catagory || !body.description) {
    res.status(400).send(` required parameter missing. example request body: 
    {
        "name": "value"
        "price": 1234
        "catagory": "value"
        "description": "value" 
    }`);
    return;
  } else {
    let newProduct = productModel.create({
      name: body.name,
      price: body.price,
      catagory: body.catagory,
      description: body.description,
    });
  }
});

app.get("/weather", (req, res) => {
  console.log(`${req.ip} is asking for weather`);

  res.send({
    city: "karachi",
    temp_c: 26,
    humidity: 72,
    max_temp_c: 31,
    min_temp_c: 19,
  });
});

const __dirname = path.resolve();
app.get("/", express.static(path.join(__dirname, "/web/index.html")));
app.use("/", express.static(path.join(__dirname, "/web")));

//  172.16.19.78:3000/water

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mongodbUrl =
  "mongodb+srv://admin:admin123@cluster0.jsnad.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongodbUrl);

mongoose.connection.on("connected", () => {
  console.log("MongoDB is Connected.");
}); // if connected

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB is Disconnected.");
  process.exit(1); // for terminating or stoping app.
}); //if disconnected

mongoose.connection.on("error", (err) => {
  console.log("There is any Error: ", err);
  process.exit(1);
}); // if any error

mongoose.connection.on("SIGINT", () => {
  console.log("App is terminating.");
  mongoose.connection.close(() => {
    console.log("Mongoose Default Connection closed");
    process.exit(0);
  });
});
