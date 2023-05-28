// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports={

    postAddAddress: (req, res) => {

        console.log('address Details');

        let uid = req.session.userDetails._id
        let uname = req.session.userDetails.username
        console.log('adress');
        console.log(req.body)

        let data = req.body
        let obj = {
            userId: ObjectId(uid),
            type: data.type,
            name: data.name,
            address: data.address,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            phone: data.phone

        }
        userHelpers.postAddAddress(obj).then((response) => {
            const previousUrl = req.header('Referer');

            if (response) {

                res.redirect(previousUrl)
            } else {
                res.redirect(previousUrl)
            }

        })

    },
    getDeleteAddress:(req,res)=>{

        const previousUrl = req.header('Referer');
        console.log('heloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        console.log(req.params.id)
      
        let id=req.params.id
        userHelpers.deleteAddress(id).then((response)=>{

            if(response)
            {
                console.log('address delete succfull');
                res.redirect(previousUrl)

            }else{

                console.log('address not deleted ');
                res.redirect(previousUrl)



            }
        })
       

    },
    helo:(req,res)=>{
        console.log('helo')
    }
}