var collection=require('../config/collections')
const MongoClient=require('mongodb').MongoClient
 const state ={
     db:null
 }

 module.exports.connect=function(done){
    //  const url ='mongodb://0.0.0.0:27017'
    const url="mongodb+srv://ajmalmuhammed846:ajuZ3216@cluster0.uzyffxb.mongodb.net/?retryWrites=true&w=majority"
    //  console.log('reach ')
     MongoClient.connect(url,(err,data)=>{
      console.log('reach ')
         if(err)
         {
          console.log('enter')
          return  done(err)
         }else
         {
          console.log('enter 1')
          state.db=data.db(collection.db_name)
          done()
         }
         
     })
 }

 module.exports.get=function(){
     return state.db
 }
