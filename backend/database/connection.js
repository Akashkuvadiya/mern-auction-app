// import mongoose from "mongoose";

// export const connection = ()=>{
//     mongoose.connect(process.env.MONGO_URI,{
//         dbName: "MERN_AUCTION_PLATFORM"
//     }).then(()=>{
//         console.log("MongoDB Connected Successfully ✅");
//     })
//     .catch((err)=>{
//         console.log(`Some error occured while connecting to database: ${err}`);
//     });
// };

import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("MongoDB Connected Successfully ✅");
    })
    .catch((err) => {
      console.log(`DB Error ❌: ${err}`);
    });
};