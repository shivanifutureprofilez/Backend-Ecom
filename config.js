
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res)=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err)
});
