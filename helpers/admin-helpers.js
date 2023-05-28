let db = require('../config/connection')
let collection = require('../config/collections')
const { ObjectId } = require('mongodb')
module.exports = {
  loginData: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let admin = await db.get().collection(collection.adminCollection).findOne({ email: adminData.email })
      if (admin) {
        db.get().collection(collection.adminCollection).findOne({ password: adminData.password }).then((data) => {
          if (data) {
            console.log('admin login successfullly')
            let status= true
            resolve(status)
          } else {
             let status= false
            resolve(status)
            console.log('incorrect password')
          }
        })
      } else {
         let status= false
         resolve(status)
        console.log('user not found')
      }
    })
  },
  addProducts: (productData, images) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.productCollection).insertOne(productData).then((data) => {

        if (data) {
          db.get().collection(collection.productCollection).updateOne({ title: productData.title }, { $set: { image: images } }).then((data) => {
            if (data) {
              console.log('product details and image details added in database')
            }
            else {
              conosle.log('only added in product details')
            }
          })
        } else {
          console.log('mission rejected')
        } 
      })
    })
  },
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.productCollection).find().toArray().then((data) => {
        if (data) {
          
          resolve(data)
        }
        else {
          
          console.log('data not found')
          resolve(data)
        }
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  },
  deleteProduct: (pid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.productCollection).remove({ _id: ObjectId(pid) }).then((data) => {
        if (data) {

          console.log('product deleted successfully')
          resolve(data)
        } else {
          console.log('product not delete, mission failed')
        }
      })
    })
  },
  getOneProduct: (pid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.productCollection).findOne({ _id: ObjectId(pid) }).then((data) => {
        if (data) {
          
         
          resolve(data)

        } else {
          console.log('mission failed')
        }
      })
    })
  },
  updateProduct: (productData, pid, images) => {
    return new Promise((resolve, reject) => {
      if(images.length===0)
      {
        db.get().collection(collection.productCollection).updateOne({ _id: ObjectId(pid) }, {
          $set: {
            title: productData.title,
            description: productData.description,
            price: productData.price,
            quantity: productData.quantity,
            category:productData.category,

            
          }
        }).then((data) => {
          if (data) {
            console.log('update successfully without image')
            resolve(data)
          }
        })

      }else{
        db.get().collection(collection.productCollection).updateOne({ _id: ObjectId(pid) }, {
          $set: {
            title: productData.title,
            description: productData.description,
            price: productData.price,
            quantity: productData.quantity,
            category:productData.category,
            image:images
          }
        }).then((data) => {
          if (data) {
            console.log('update successfully')
            resolve(data)
          }
        })

      }
      
    })
  },
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.userCollection).find().toArray().then((data) => {
        if (data) {
          console.log('all users')
          console.log(data)
          resolve(data)
        }
      })
    })
  },
  blockUser: (pid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.userCollection).updateOne({ _id: ObjectId(pid) }, { $set: { block: true } }).then((data) => {
        if (data) {
          resolve(data)
        }
        else {
          resolve(data)
        }
      })
    })
  },


  unBlockUser: (pid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.userCollection).updateOne(
        { _id: ObjectId(pid) },
        { $set: { block: false } }
      ).then((result) => {
        if (result.modifiedCount > 0) {
          console.log('User unblocked successfully!');
          resolve(result);
        } else {
          const err = new Error(`Could not unblock user ${pid}`);
          console.error(err);
          reject(err);
        }
      }).catch((err) => {
        console.error('Error unblocking user', err);
        reject(err);
      });
    })

  },
  addCategories: (data, image) => {

    return new Promise((resolve, reject) => {
      
      // let exist =db.get().collection(collection.categoryCollection).find({name:data.name})
      db.get().collection(collection.categoryCollection).find({name:data.name}).toArray().then((response_1)=>{
        console.log('existed checking data',response_1)
        if(response_1.length===0)
        {
          console.log('inserting new');
          db.get().collection(collection.categoryCollection).insertOne(data).then((response) => {
           
            if (response) {
              console.log('inserted succesdsfull');
              db.get().collection(collection.categoryCollection).updateOne({ name: data.name }, { $set: { image: image } }).then((data) => {
                console.log('inserting and updating succsessfull');
                resolve(response)
              })
            } else {
              console.log('not inserted');
              resolve(response)
            }
          })
        
        }else{
          
          console.log('this categoroy allready added');
          resolve()
  
        }
      })   

      })
      
        
  },
  getAllCategories: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.categoryCollection).find().toArray().then((data) => {
        if (data) {

          resolve(data)
        } else {
          resolve(data)
        }
      })
    })
  },
  findOneCategory: (pid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.categoryCollection).findOne({ _id: ObjectId(pid) }).then((data) => {
        if (data) {
          console.log(data)
          resolve(data)


        } else {
          console.log(data)
          resolve(data)
        }
      })
    })
  },
  updateCategory: (productData, pid,image) => {

    return new Promise((resolve, reject) => {

      if(image.length===0)
      {
        db.get().collection(collection.categoryCollection).find({name:productData.name}).toArray().then((response)=>{
      
          if(response.length===0)
          {
             db.get().collection(collection.categoryCollection).findOne({_id:ObjectId(pid)}).then((response2)=>{
             console.log('find previuos catgory detals');
              console.log(response2)
              db.get().collection(collection.productCollection).updateMany({category:response2.name},{$set:{category:productData.name}}).then((response3)=>{
                console.log('products base on cateogry')
                console.log(response3)
                db.get().collection(collection.categoryCollection).updateOne({ _id: ObjectId(pid) },
                {
                  $set:
                  {
                    name: productData.name,
                    description: productData.description,
                    
                  } }).then((data) => {
                    console.log('updated succesfully without photo');
                    
                    console.log(data);
                    let exist=false
                  resolve(exist)
                })
    
    
                 })

              })
              


           
            
          }else{
    
    
            
            console.log('category exist');
            console.log(response);
            let exist=true
            resolve(exist)
    
             
          }
         })

      }else{

        db.get().collection(collection.categoryCollection).find({name:productData.name}).toArray().then((response)=>{
      
          if(response.length===0)
          {
            db.get().collection(collection.categoryCollection).updateOne({ _id: ObjectId(pid) },
            {
              $set:
              {
                name: productData.name,
                description: productData.description,
                image:image
              } }).then((data) => {
                console.log('updated succesfully');
                
                console.log(data);
                let exist=false
              resolve(exist)
            })
            
          }else{
    
    
            
            console.log('category exist');
            console.log(response);
            let exist=true
            resolve(exist)
    
             
          }
         })
      }
     


      
    })
  },
  deleteCategory: (pid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.categoryCollection).remove({ _id: ObjectId(pid) }).then((data) => {
        resolve(data)
      })
    })
  },
  getProducts: (pid) => {

    return new Promise((resolve, reject) => {
      db.get().collection(collection.productCollection).find({ _id: ObjectId(pid) }).toArray().then((response) => {
        if (response) {
          console.log('llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll');
          console.log(response)
          resolve(response)
        }
      })
    })
  },
  viewOrders:()=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.ordersCollection).find().toArray().then((response)=>{
        
        if(response)
        {
          console.log('product collection getting successfully')
          resolve(response)
          
        }else{

          console.log('products didnt get');
        }
      })
    })
  },
  changeOrderStatus:(id,status)=>{

    return new Promise((resolve,reject)=>{


      db.get().collection(collection.ordersCollection).updateOne({_id:ObjectId(id)},{$set:{order_status:status}}).then((response)=>{

        if(response)
        {
          if(status==='delivered')
          {
            db.get().collection(collection.ordersCollection).updateOne({_id:ObjectId(id)},{$set:{payment_status:'succeed'}}).then((response2)=>{
              if(response2)
              {
                  console.log('orderdeliveres and payment successfull')
                  resolve(response)
              }
            })
          }
          console.log('order Status change succesfully')
         
        }
      })
    })
  },
  addCoupon:(data)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.coupenCollection).insertOne(data).then((response)=>{

        if(response)
        {
          console.log('coupon data inserted succesfulll')
          resolve(response)
        }else{

            console.log('coupen data is not inserted')
        }
      })
    })
  },
  getSales:(start,end)=>{


    return new Promise((resolve,reject)=>{

      console.log('looooooooooooooooooooooo',new Date(start),new Date(end))

      const query={
        date:{
          $gte: new Date(start),
          $lte: new Date(end)
        }
      }

      db.get().collection(collection.ordersCollection).find(query).toArray().then((response)=>{

        console.log('database orders between in the input date>>>')
        console.log(response)
        resolve(response)
      })
    })
  },
  getAllCoupons:()=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.coupenCollection).find().toArray().then((response)=>{
        resolve(response)
      })
    })
  },
  addOfferPriceProduct:(pid,offerprice,offerExpire)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.productCollection).updateMany({_id:ObjectId(pid)},{$set:{offerprice:offerprice,offerExpire:offerExpire}}).then((response)=>{

        if(response)
        {
           console.log('offer price added succsfully')
           resolve(response)
        }else
        {
          console.log('offer price not adede some any problems found')
        }
      })
    })

  },
  addOfferCat:(catName,percentage,date)=>{

    return new Promise((Resolve,reject)=>{

      db.get().collection(collection.productCollection).find({category:catName}).toArray().then((response)=>{

      
        
        response.forEach(element => {
          pid=element._id
          price=Number(element.price)
          
          per=Number(percentage)
          discount=(per/100)*price
      
          offerprice=price-discount
          offerprice= Math.floor(offerprice)
          
          console.log('product price:',price,'- discount amount:',discount,'=',offerprice)
          
          db.get().collection(collection.productCollection).updateOne({_id:ObjectId(pid)},{$set:{offerprice:offerprice,offerExpire:date}}).then((response)=>{

            if(response)
            {

              console.log('category offer succesfulll')
            }else{
              
              console.log('category offer not working')
            }
          })

        });
        console.log(`congratulations ,'alll category offer is done '`)

        
      })
    })
  },
  getRevenue:((req,res)=>{

    return new Promise((resolve,reject)=>{

      db.get().collection(collection.ordersCollection).aggregate([
        {$group:{_id:null,totalRevenue:{$sum:{$toDouble:"$total_amount"}}}},
        {$project:{_id:0,totalRevenue:1}}
      ]).toArray((err,result)=>{
        if(err)
        {
          console.log('some error founded in aggregation during get total revenue',err)
        }else if(result){

          console.log('aggrrgation success',result)
          resolve(result)
        }
      })
    })
  }),
   getOnlinePayments:(req,res)=>{

    return new Promise((resolve,reject)=>{

     db.get().collection(collection.ordersCollection).aggregate([{$match:{payment_method:'razorpay'}}]).toArray().then((result)=>{

    
        // Handle the result
        if(result)
        {
          
          resolve(result)
        }
        
      })
    })
   },
   getCashonDelivery:()=>{
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.ordersCollection).aggregate([{$match:{payment_method:'COD'}}]).toArray().then((result)=>{
 
     
         // Handle the result
         if(result)
         {
          
           resolve(result)
         }
         
       })
     })
    
   },
   getWalletCount:()=>{
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.ordersCollection).aggregate([{$match:{payment_method:'wallet'}}]).toArray().then((result)=>{
 
     
         // Handle the result
         if(result)
         {
          
           resolve(result)
         }
         
       })
     })
    
   },
  deleteCoupon:(id)=>{
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.coupenCollection).deleteOne({_id:ObjectId(id)}).then((response)=>{

        if(response)
        {
         
          resolve(response)
        }
      })
    })
  },
  getMonthlyData:()=>{
    return new Promise(async(resolve,reject)=>{
     
      const monthlyRevenue = await db.get().collection(collection.ordersCollection).aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$date" }
            },
            total: {
              $sum: { $toDouble: "$total_amount" }
            }
          }
        },
        {
          $project: {
          month: "$_id.month",
          _id: 0,
          total: 1
          }
        },
        {
          $sort: {
            month: 1
          }
        },
        {
          $project: {
            months: {
              $arrayElemAt: [
                [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ],
                { $subtract: ["$month", 1] }
              ]
            },
            total: {
              $ifNull: ["$total", 0]
            }
          }
        },
        {
          $group: {
            _id: null,
            data: {
              $push: {
                total: "$total",
                months: "$months"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            data: {
              $setUnion: [
                "$data",
                [
                  { total: 0, months: "January" },
                  { total: 0, months: "February" },
                  { total: 0, months: "March" },
                  { total: 0, months: "April" },
                  { total: 0, months: "May" },
                  { total: 0, months: "June" },
                  { total: 0, months: "July" },
                  { total: 0, months: "August" },
                  { total: 0, months: "September" },
                  { total: 0, months: "October" },
                  { total: 0, months: "November" },
                  { total: 0, months: "December" }
                ]
              ]
            }
          }
        },
        {
          $unwind: "$data"
        },
        {
          $replaceRoot: {
            newRoot: "$data"
          }
        }
      ]).toArray();
      console.log(monthlyRevenue);
      resolve(monthlyRevenue);
      
  
    })
  }

  




}