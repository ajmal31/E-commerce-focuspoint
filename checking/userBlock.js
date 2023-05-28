const db = require('../config/connection')
const collection = require('../config/collections')

module.exports = {
   userBlock: (userMail) => {
      return new Promise((resolve,reject)=>{
         db.get().collection(collection.userCollection).findOne({ email: userMail, block: { $eq: true } }).then((data) => {
            if (data) {
               console.log('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
               console.log(data);
               resolve(data)
            } else {
               console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
               console.log(data);
               resolve(data)
            }
         })

      })
      // db.inventory.find({ _id: ObjectId("60a2f7ffda65fcbeaa9fc594"), "item.name": { $eq: "ab" } })


   }
}
