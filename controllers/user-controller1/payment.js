// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')

module.exports={

    postVerifyPayment:(req,res)=>{


        console.log('verify payment successfull')
        console.log(req.body);

       
        userHelpers.verifyPayment(req.body).then((response)=>{
          
            if(response)
            {

                let orderId=req.body.order.receipt
                
                
                userHelpers.changePaymentStatus(orderId).then((response)=>{

                    console.log('after veriffyinggggg');
                    console.log(orderId)
                      console.log(response);
                    res.json(response)
                })
                
            }


        })
    },
}