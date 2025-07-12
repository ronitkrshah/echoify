require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Enviroment = require("./env");
const appRouter = require("./routes");
const { InnertubeService } = require("./services");

const app = express();
{
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(morgan("tiny"));

    // Routes
    app.use("/api", appRouter);
}

async function main() {
    await InnertubeService.setupInnertube();
    app.listen(Enviroment.PORT, () => {
        console.log("Server Running On PORT:", Enviroment.PORT);
    });
}

main();
