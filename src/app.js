const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const hbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(bodyParse.json());
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  hbs({
    layoutsDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "default",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(require("./routes/index.routes"));

//Port
const PORT = process.env.PORT || 3000;


//Conexión a base de datos y levantamiendo del servidor
(async () => {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
        console.log("app linning");
      });
})();
