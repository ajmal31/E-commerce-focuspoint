let db = require('../config/connection')
let collection = require('../config/collections')
let bcrypt = require('bcrypt')
const SSID = process.env.ssid
const twilio = require('twilio');
const { ObjectId } = require('mongodb');
const TWILIO_ACCOUNT_SID = process.env.accountSid
const TWILIO_AUTH_TOKEN = process.env.auth
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const Razorpay = require('razorpay');


var instance = new Razorpay({
  key_id: 'rzp_test_FqE7lxwHbHUy8A',
  key_secret: 'w8jb9ijjMG8qcHAa602JfsSg',
});


module.exports = {
  signupData: (userData) => {
    return new Promise(async (resolve, reject) => {

      userData.password = await bcrypt.hash(userData.password.toString(), 10)

      console.log('bcrypt password', userData.password)

      db.get().collection(collection.userCollection).insertOne(userData).then((data) => {
        console.log('check', data)
        resolve(data)
      })
    })
  },

  loginData: (userData) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.userCollection).findOne({ email: userData.email }).then((user) => {

        if (!user) {

          console.log('User not found');
          let userfound=false
          resolve(userfound)

        }
        else {

          bcrypt.compare(userData.password, user.password).then((result) => {

            if (result) {

              console.log('Login successful');

              resolve(user)

            }
            else {
              console.log('Incorrect password');
              resolve(result)
            }
          });
        }
      })
        .catch(err => {
          console.error(err);
        });
    });
  },



  checkNumber: (phone) => {

    return new Promise((resolve, reject) => {

      console.log('checkumber enter the helpers')

      db.get().collection(collection.userCollection).findOne({ phone: phone }).then((data) => {
        if (data) {
          console.log('number finding database')
          let err = false
          let name = data.username
          let phone = data.phone


          console.log(SSID,'ssid')
          client.verify.services(SSID).verifications.create({ to: `+91${phone}`, channel: 'sms' }).then(() => {
            console.log('otp verifying')
            resolve({ err, phone, name, data })

          }).catch((err)=>{
            console.log('err')
            console.log(err)
          })



        } else {
          let err = true

          resolve({ err })
        }
      })
    })
  },

  checkOtp: (otp, phone) => {
    return new Promise((resolve, reject) => {

      client.verify.services(SSID).verificationChecks.create({ to: `+91${phone}`, code: otp }).then((check) => {

        console.log(check)

        if (check.valid) {


          resolve({ err: false })

        } else {

          resolve({ err: true })
        }

      })

    })
  },

  shop: (catName) => {
    console.log("BRO");
    return new Promise((resolve, reject) => {
     
      db.get().collection(collection.productCollection).find({ category: catName }).toArray().then((data) => {
        console.log(data)
        resolve(data)
      })
    })
  },



  // addToCart: (pid, uid) => {
  //   return new Promise((resolve, reject) => {



  //         db.get().collection(collection.cartCollection).findOne({ userId: ObjectId(uid), productList: {  $elemMatch: { pid: ObjectId(pid) }}}).then((cart) => {
  //           if (!cart) {
  //             // If the user doesn't have a cart, create a new one
  //             db.get().collection(collection.cartCollection).insertOne({userId: ObjectId(uid),productList: [{ pid: ObjectId(pid), quantity: parseInt("1") }]}).then((data) => {



  //              let exist=false
  //              resolve({exist});

  //             })
  //           } else {




  //             let exist=true
  //             resolve({exist});

  //           }
  //         })




  //   });
  // },

  addToCart: (pid, uid) => {
    return new Promise((resolve, reject) => {


      db.get().collection(collection.cartCollection).find({ userId: ObjectId(uid) }).toArray().then((response) => {

        if (!response.length == 0) {
          // db.get().collection(collection.cartCollection).findOne({userId:ObjectId(uid)},{productList:{ $elemMatch : { pid:ObjectId(pid)}}}).then((result)=>{
          db.get().collection(collection.cartCollection).findOne({ userId: ObjectId(uid), productList: { $elemMatch: { pid: ObjectId(pid) } } }).then((result) => {


            if (result) {

              let exist = true
              resolve({ exist })
            } else {

              db.get().collection(collection.cartCollection).updateOne({ userId: ObjectId(uid) }, { $push: { productList: { pid: ObjectId(pid), quantity: Number(1) } } }).then((data) => {
                if (data) {

                  let exist = false
                  resolve({ exist })
                }
              })
            }

          })
        } else {

          db.get().collection(collection.cartCollection).insertOne({ userId: ObjectId(uid), productList: [{ pid: ObjectId(pid), quantity: Number(1) }] }).then((data) => {

            if (data) {

              let exist = false
              resolve({ exist })
            }
          })
        }

      })
    })
  },


  getCartProducts: (uid) => {
    return new Promise((resolve, reject) => {

       db.get().collection(collection.cartCollection).aggregate([

        {

          $match: { userId: ObjectId(uid) }


        },
        {
          $unwind: '$productList'
        },
        {
          $project: {
            userId: '$userId',
            pid: '$productList.pid',
            quantity: '$productList.quantity'
          }
        },
        {
          $lookup: {
            from: collection.productCollection,
            localField: 'pid',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $project: {
            userId: 1, pid: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] }
          }
        }


      ]).toArray((err, docs) => {
        if (err) {

        } else {

          resolve(docs)

        }
      })

    })
  },

  changeCartCount: (uid, details) => {

    count=Number(details.count)
    quantity=Number(details.quantity)
    pid=details.pid
    

    return new Promise((resolve, reject) => {

      if(count===-1&&quantity===1)
      {

        db.get().collection(collection.cartCollection).updateOne(
          { userId: ObjectId(uid) },
          { $pull: { productList: { pid: ObjectId(pid) } } }
        ).then((remove) => {
          
          remove=true
          console.log('remove succfully due to 0quantity',);
          resolve({update:false,remove:true})
          // ...
        });
      }else{

        db.get().collection(collection.cartCollection).updateOne({ userId: ObjectId(uid), "productList.pid": ObjectId(pid) }, { $inc: { "productList.$.quantity": Number(count) } }).then((response) => {

          if (response) {
  
            console.log('updated succefullly');
             
             update=true
             
            resolve({update:true,remove:false})

          } else {

            console.log('not updated');
            resolve(response)
          }
        })
      }

     


    })
  },
  // changeCartCount: (uid, pid, count) => {

  //   return new Promise((resolve, reject) => {


  //     db.get().collection(collection.cartCollection).updateOne({ userId: ObjectId(uid), "productList.pid": ObjectId(pid) }, { $set: { "productList.$.quantity": Number(count) } }).then((response) => {

  //       if (response) {


  //         resolve(response)
  //       } else {

  //         resolve(response)
  //       }
  //     })


  //   })
  // },
  removeCartProduct: (pid, uid) => {
    return new Promise((resolve, reject) => {

      db.get().collection(collection.cartCollection).updateOne({ userId: ObjectId(uid) }, { $pull: { productList: { pid: ObjectId(pid) } } }).then((response) => {
        if (response) {
          console.log('product remove successully');
          resolve(response)

        } else {

          console.log('product not remove some eror ');
          resolve(response)
        }
      })


    })
  },

  postAddAddress: (userAddress, uid) => {

    return new Promise((resolve, reject) => {


      db.get().collection(collection.addressCollection).insertOne(userAddress).then((data) => {

        if (data) {
          console.log('user Address inserted to adddress collection');
          let data = true
          resolve(data)

        } else {
          console.log('user Address not inserted to adress collection');
          let data = false
          resolve(data)
        }

      })





    })
  },

  //  postAddAddress:(userAddress,uid,uname)=>{

  //    return new Promise((resolve,reject)=>{


  //        db.get().collection(collection.addressCollection).insertOne({userId:ObjectId(uid)})
  //    })
  //  },

  getUserAddress: (uid) => {
    return new Promise((resolve, reject) => {

      db.get().collection(collection.addressCollection).find({ userId: ObjectId(uid) }).toArray().then((response) => {

        resolve(response)
      })

    })
  },
  getUserSpecificAddress: (addressId) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.addressCollection).findOne({ _id: ObjectId(addressId) }).then((Response) => {

        resolve(Response)
      })
    })
  },
  placeOrder: (cartProducts, userAddress, uid, totalAmount, payment) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.ordersCollection).insertOne({

        ownerId: uid,
        date: new Date(),
        products: cartProducts,
        address: userAddress,
        payment_method: payment,
        payment_status: 'pending',
        total_amount: totalAmount,
        order_status: 'pending',

      }).then((response) => {
        if (response) {
          console.log('order placed successfull `cash on delivery');
          console.log(response.insertedId)

          resolve(response.insertedId)

          console.log('order not placed')
          resolve(response)
        }
      })




      // db.get().collection(collection.ordersCollection).insertOne({

      //   ownerId: uid,
      //   date: new Date(),
      //   products: cartProducts,
      //   address: userAddress,
      //   payment_method: payment,
      //   payment_status: 'pending',
      //   total_amount: totalAmount,
      //   order_status: 'pending',

      // }).then((response) => {
      //   if (response) {
      //     console.log('order placed successfull`but online payment pending');
      //     console.log(response.insertedId)
      //     resolve(response.insertedId)
      //   } else {
      //     console.log('order not placed')
      //     resolve(response)
      //   }
      // })




    })

  },
  removeCartData: (uid) => {
    return new Promise((resolve, reject) => {

      db.get().collection(collection.cartCollection).deleteOne({ userId: ObjectId(uid) }).then((response) => {
        resolve(response)
      })
    })
  },
  getAllOrders: (uid) => {

    return new Promise((resolve, reject) => {
      console.log('userId', uid)

      db.get().collection(collection.ordersCollection).find({ ownerId: uid }).toArray().then((response) => {

        resolve(response)
      })
    })
  },
  getOneOrder: (id) => {
    return new Promise((resolve, reject) => {

      db.get().collection(collection.ordersCollection).findOne({ _id: ObjectId(id) }).then((response) => {

        resolve(response)
      })
    })
  },
  deleteAddress: (id) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.addressCollection).deleteOne({ _id: ObjectId(id) }).then((response) => {

        resolve(response)
      })
    })
  },


  generateRazorpay: (orderId, total) => {

    return new Promise((resolve, reject) => {

      var options = {

        amount: Number(total) * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: orderId.toString()

      };

      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log('error found');
          console.log(err);

        } else {

          console.log('order created');

          console.log(order);

          resolve(order)

        }

      });


    })
  },

  verifyPayment: (data) => {


    return new Promise((resolve, reject) => {

      console.log(data)

      let body = data.order_id + "|" + data.payment_id;

      var crypto = require("crypto");
      var expectedSignature = crypto.createHmac('sha256', 'w8jb9ijjMG8qcHAa602JfsSg').update(body.toString()).digest('hex');

      console.log("sig received ", data.signature);

      console.log("sig generated ", expectedSignature);

      var response = { "signatureIsValid": "false" }

      if (expectedSignature === data.signature)

        response = { "signatureIsValid": "true" }


      console.log("response");
      console.log(response);
      resolve(response)





    })
  },
  changePaymentStatus: (orderId) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.ordersCollection).updateOne({ _id: ObjectId(orderId) }, { $set: { payment_status: 'succeed' } }).then((response) => {

        if (response) {
          console.log('status change succesfully')
          resolve(response)
        } else {

          console.log('status not change');
        }
      })
    })
  },
  checkCoupenExist: (code) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.coupenCollection).findOne({ couponCode: code }).then((response) => {

        if (response) {
          console.log('find', response)
          resolve(response)
        } else {
          console.log('the coupen code is not existing')
          resolve(response)
        }
      })
    })
  },
  cancelOrder: (id) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.ordersCollection).updateOne({ _id: ObjectId(id) }, { $set: { order_status: 'cancelled' } }).then((response) => {
        if (response) {

          console.log('orderStatus changed succesfull')
          resolve(response)
        } else {
          console.log('ordersttus not changed.................................')
        }
      })
    })
  },
  returnOrder: (id) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.ordersCollection).updateOne({ _id: ObjectId(id) }, { $set: { order_status: 'returnRequested' } }).then((response) => {
        if (response) {
          console.log('orderStatus changed succesfull')
          resolve(response)
        } else {
          console.log('ordersttus not changed.................................')
        }
      })
    })
  },
  addWishlist: (pid, uid) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.wishlistCollection).find({ userId: ObjectId(uid) }).toArray().then((response) => {

        if (!response.length == 0) {
          // db.get().collection(collection.cartCollection).findOne({userId:ObjectId(uid)},{productList:{ $elemMatch : { pid:ObjectId(pid)}}}).then((result)=>{
          db.get().collection(collection.wishlistCollection).findOne({ userId: ObjectId(uid), productList: { $elemMatch: { pid: ObjectId(pid) } } }).then((result) => {


            if (result) {

              let exist = true
              resolve({ exist })
            } else {

              db.get().collection(collection.wishlistCollection).updateOne({ userId: ObjectId(uid) }, { $push: { productList: { pid: ObjectId(pid) } } }).then((data) => {
                if (data) {

                  let exist = false
                  resolve({ exist })
                }
              })
            }

          })
        } else {

          db.get().collection(collection.wishlistCollection).insertOne({ userId: ObjectId(uid), productList: [{ pid: ObjectId(pid), }] }).then((data) => {

            if (data) {

              let exist = false
              resolve({ exist })
            }
          })
        }

      })
    })
  },  // checkPaymentStatus:(oid)=>{

  //   return new Promise((resolve,reject)=>{

  //     db.get().collection(collection.ordersCollection).findOne({_id:ObjectId(oid)}).then((response)=>{


  //       resolve(response)
  //     })
  //   })
  // },

  getAllWishlistProducts: (uid) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.wishlistCollection).aggregate([

        {

          $match: { userId: ObjectId(uid) }


        },
        {
          $unwind: '$productList'
        },
        {
          $project: {
            userId: '$userId',
            pid: '$productList.pid',
            
          }
        },
        {
          $lookup: {
            from: collection.productCollection,
            localField: 'pid',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $project: {
            userId: 1, pid: 1,  products: { $arrayElemAt: ['$products', 0] }
          }
        }


      ]).toArray((err, docs) => {
        if (err) {

        } else {

          console.log('whilslit final result',docs)

          resolve(docs)

        }
      })

    })
  },

  
  addToWallet: (uid, amount) => {

    return new Promise((resolve, reject) => {

      

      db.get().collection(collection.walletCollection).findOne({ userId: ObjectId(uid) }).then((response) => {

        if (response) {

          let totalWalletAmount=Number(response.walletAmount)+Number(amount)

          db.get().collection(collection.walletCollection).updateOne({userId:ObjectId(uid)},{$set:{walletAmount:totalWalletAmount}}).then((response2)=>{

            if(response2)
            {
              console.log('updation succesflly')
              resolve(response)
            }
          })

        } else {
          db.get().collection(collection.walletCollection).insertOne({ userId: ObjectId(uid), walletAmount: amount }).then((response) => {

            if (response) {
              console.log('add to wallet succesfull')
              resolve(response)
            } else {
              console.log('amount not added in the wallet')
            }

          })

        }
      })


    })

  },
  finduserWallet:(uid)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.walletCollection).findOne({userId:ObjectId(uid)}).then((response)=>{

        resolve(response)
      })
    })
  },
  updateWalletAmount:(uid,walletAmount)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.walletCollection).updateOne({userId:ObjectId(uid)},{$set:{walletAmount:walletAmount}}).then((response)=>{
        if(response)
        {
          console.log('wallet amount update successfullt')
          resolve(response)
        }else{
          console.log('wallet amount not updated')
        }
      })
    })
  },
  getWallet:(uid)=>{
 
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.walletCollection).findOne({userId:ObjectId(uid)}).then((response)=>[

        resolve(response)
      ])
    })
  },
  getAddCoupon:()=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.coupenCollection).find().toArray().then((response)=>{

        resolve(response)
      })
    })
  },
  createWallet:(uid)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.walletCollection).insertOne({userId:ObjectId(uid),walletAmount:0}).then((response)=>{

        if(response)
        {
          console.log('wallet createed succesfully')
          resolve(response)
        }else{
          console.log('wallet not created')
        }
      })
    })
  },
  passwordChecking:(uid,data)=>{
    return new Promise(async (resolve,reject)=>{

      
      let password=data.password
      console.log('user requestd password')
      console.log(password);
     

      db.get().collection(collection.userCollection).findOne({_id:ObjectId(uid)}).then((response)=>{

      console.log('repsonse');
        console.log(response)
        let compare= bcrypt.compare(password,response.password)

          if(compare)
          {
            console.log(' current password is valid');
            resolve(compare)
          }else{
            console.log('cuurent passwor invalid')
            resolve(compare)
          }
        
      })
    })
  },
  updatePassword:(uid,newpassword)=>{
    return new Promise(async(resolve,reject)=>{

      newpassword= await bcrypt.hash(newpassword.toString(),10)
      console.log('after hashing',newpassword);

      db.get().collection(collection.userCollection).updateOne({_id:ObjectId(uid)},{$set:{password:newpassword}}).then((response)=>{
        console.log('after update');
        console.log(response);
        if(response)
        {
          console.log('password updated succefull');
          resolve(response)
        }else
        {
          console.log('password not updated')
        }
      })
    })
  },
//   getCartTotal:(uid)=>{

//     return new Promise(async(resolve,reject)=>{

//       const monthlyRevenue = await db.get().collection(collection.cartCollection).aggregate([
//         {
//           $match: { userId: ObjectId(uid) }
//         },
//         {
//           $unwind: '$productList'
//         },
//         {
//           $project: {
//             userId: '$userId',
//             pid: '$productList.pid',
//             quantity: '$productList.quantity',
//           },
//         },
//         {
//           $lookup: {
//             from: collection.productCollection,
//             localField: 'pid',
//             foreignField: '_id',
//             as: 'products'
//           }
//         },
//         {
//           $project: {
//             quantity: 1,
//             productprice: {
//               $cond: {
//                 if: {
//                   $and: [
//                     { $gt: [{ $size: '$products' }, 0] },
//                     { $lte: ['$products.offerExpire', new Date()] }
//                   ]
//                 },
//                 then: {
//                   $cond: {
//                     if: { $and: [{ $isArray: '$products.offerprice' }, { $gt: [{ $size: '$products.offerprice' }, 0] }] },
//                     then: { $arrayElemAt: ['$products.offerprice', 0] },
//                     else: { $arrayElemAt: ['$products.price', 0] }
//                   }
//                 },
//                 else: { $arrayElemAt: ['$products.price', 0] }
//               }
//             }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             subtotal: { $sum: { $multiply: ['$quantity', '$productprice'] } }
//           }
//         },
//         {
//           $project: {
//             cartTotal: { $sum: '$subtotal' }
//           }
//         }
//       ]).toArray();
//        console.log('filter cart total', monthlyRevenue);      
//       resolve(monthlyRevenue);
//     });
//  },

      


 //******* */
      getCartTotal:(uid)=>{

    return new Promise(async(resolve,reject)=>{

      const monthlyRevenue = await db
      .get()
      .collection(collection.cartCollection)
      .aggregate([
        {
          $match: { userId: ObjectId(uid) }
        },
        {
          $unwind: "$productList"
        },
        {
          $project: {
            userId: "$userId",
            pid: "$productList.pid",
            quantity: "$productList.quantity"
          }
        },
        {
          $lookup: {
            from: collection.productCollection,
            localField: "pid",
            foreignField: "_id",
            as: "products"
          }
        },
        {
          $project: {
            quantity: 1,
            productprice: {
              $cond: {
                if: {
                  $and: [
                    { $gt: [{ $size: "$products" }, 0] },
                    {
                      $lt: [
                        {
                          $dateToString: {
                            date: new Date(),
                            format: "%Y-%m-%d"
                          }
                        },
                        { $arrayElemAt: ["$products.offerExpire", 0] }
                      ]
                    }
                  ]
                },
                then: {
                  $cond: {
                    if: {
                      $and: [
                        { $isArray: "$products.offerprice" },
                        { $gt: [{ $size: "$products.offerprice" }, 0] }
                      ]
                    },
                    then: { $arrayElemAt: ["$products.offerprice", 0] },
                    else: { $arrayElemAt: ["$products.price", 0] }
                  }
                },
                else: { $arrayElemAt: ["$products.price", 0] }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            subtotal: { $sum: { $multiply: ["$quantity", "$productprice"] } }
          }
        },
        {
          $project: {
            cartTotal: { $sum: "$subtotal" }
          }
        }
      ])
      .toArray();
    
    console.log("filter cart total", monthlyRevenue);
    resolve(monthlyRevenue);
    
    });
 },
//******** */
  


  getEachProductTotal: (uid) => {
  
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.cartCollection).aggregate([
        {
          $match:{userId:ObjectId(uid)}
        },
        {
          $unwind:'$productList',
        },
       {
        $project:{

          userId:'$userId',
          pid:'$productList.pid',
          quantity:'$productList.quantity',
        }
       },
       {
        $lookup:{
          from:collection.productCollection,
          localField:'pid',
          foreignField:'_id',
          as:'product'
        }
       },
       {
        $project:{
          userId:1,pid:1,quantity:1 ,productPrice:{ '$arrayElemAt': ['$product.price',0 ] }
        }
       },
       {
         $project:{
           subtotal:{$sum:{ $multiply: [ '$quantity', '$productPrice'] }}
         }
       }
      ]).toArray((err,docs)=>{

        if(err)
        {
          console.log('errnfounded',err)
        }else{
          subtotal=docs.map(item=>item.subtotal)
          resolve(subtotal)
        }
      })
    })
  },


  removeWishProduct:(uid,pid)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.wishlistCollection).deleteOne({userId:ObjectId(uid)},{$pull:{productList:{pid:ObjectId(pid)}}}).then((Response)=>{

        if(Response){
          console.log('product  remove ,succesfulll');
          resolve(Response)
        }
      })
    })
  },
  removeUser:(uid)=>{
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.userCollection).deleteOne({_id:ObjectId(uid)}).then((response)=>{

        if(response)
        {
          console.log('user remove succesfull........................................................................................');
          resolve(response)
        }
      })
    })
  },
    





}


