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

app.post("/product", (req, res) => {
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
    let newProduct = productModel.create(
      {
        name: body.name,
        price: body.price,
        catagory: body.catagory,
        description: body.description,
      },
      (err, saved) => {
        if (!err) {
          console.log(saved);
          res.send({ meassage: "your product is saved" });
        } else {
          res.status(500).send({ meassage: "server error" });
        }
      }
    );
  }
});

app.get("/products", (req, res) => {
  productModel.find({}, (err, data) => {
    // it will give you arrray of collections
    if (!err) {
      res.send({
        meassage: "Here is your products list",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
app.get("/product/:id", (req, res) => {
  const id = req.params.id;
  productModel.findOne({ _id: id }, (err, data) => {
    // it will only one collection.
    if (!err) {
      if (data) {
        res.send({
          meassage: "Here is your product",
          data: data,
        });
      } else {
        res.status(404).send({
          meassage: "product not found",
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});

app.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
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
      const data = await productModel
        .findByIdAndUpdate(
          id,
          {
            name: body.name,
            price: body.price,
            catagory: body.catagory,
            description: body.description,
          },
          { new: true }
        )
        .exec();
      console.log("Updated: ", data);
      res.send({
        message: "product is updated successfully",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).send({ message: "server error" });
  }
});

app.delete("products", (req, res) => {
  productModel.deleteMany({}, (err, data) => {
    if (!err) {
      res.send({
        message: "All Products has been deleted successfully",
      });
    } else {
      res.status(500).send({ message: "server error" });
    }
  });
});
app.delete("product/:id", (req, res) => {
  const id = req.params.id;
  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    console.log("Deleted Data: ", deletedData);
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product has been deleted successfully",
        });
      } else {
        res.send({
          message: "No Product found with this id:" + id,
        });
      }
    } else {
      res.status(500).send({ message: "server error" });
    }
  });
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
