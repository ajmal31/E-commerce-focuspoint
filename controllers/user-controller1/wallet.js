// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')
let adminHelpers = require('../../helpers/admin-helpers')

const { ObjectId } = require('mongodb')

module.exports={

    getWallet:(req,res)=>{

        let userdata=req.session.userDetails
        let uid=req.session.userDetails._id
    
        userHelpers.getWallet(uid).then((response)=>{
          res.render('user/wallet',{userdata,response})
        })
        
       }
}