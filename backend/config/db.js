const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()


let mongoUrl = process.env.MONGO_URL
async function ConnectMongodb() {
    return await mongoose.connect(mongoUrl)
        .then(() => console.log("db connectedd")).catch((error) => {
            console.log(error);
        })
}
module.exports = ConnectMongodb;