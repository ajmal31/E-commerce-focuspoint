// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports={


    getCart: (req, res) => {
        let uid = req.session.userDetails._id

        userHelpers.getCartProducts(uid).then((data) => {
            if (data) {

                userHelpers.getCartTotal(uid).then((cartTotal)=>{

                    userHelpers.getEachProductTotal(uid).then((subtotal)=>{

                        
                   
                 
                    
                    let userdata = req.session.userDetails
                    res.render('user/cart', { userdata, data ,cartTotal,subtotal})
                    })


                    })


                

            }
        })

    },
    addToCart: (req, res) => {

        userHelpers.addToCart(req.params.id, req.session.userDetails._id).then((response) => {

            if (response.exist) {

                const previousUrl = req.header('Referer');
                console.log('the product already exist in the cart');
                res.redirect(previousUrl)


            } else {
                const previousUrl = req.header('Referer');
                console.log('product added to cart');
                res.redirect(previousUrl)
            }



        })
    },
    postCartCount: (req, res) => {


        console.log('ajax request recieved')
        console.log('ajax recieved count', req.body.quantity)
        let uid = req.session.userDetails._id
        let pid = req.body.pid
        let count = req.body.count
        let quantity=req.body.quantity
        console.log('calling user helpers');
        userHelpers.changeCartCount(uid,req.body).then((response)=>{
            if(response.remove||response.update)
            {
                
                
                
                userHelpers.getCartTotal(uid).then((cartTotal)=>{
                    userHelpers.getEachProductTotal(uid).then((subtotal)=>{
                        console.log('ajax return ',cartTotal,subtotal);
                        let obj={
                            response:response,
                            cartTotal:cartTotal,
                            subtotal:subtotal

                        }
                        res.json(obj)

                    })
                })
               
            }else{
                console.log('waitinggggggggggggggggggggggggggggggggg');
            }
        })
    },
    getRemoveCartProduct: (req, res) => {

        console.log('ajax cart product spotted')
        console.log(req.body);
        let pid = req.body.pid
        let uid = req.session.userDetails._id
        console.log(pid);
        userHelpers.removeCartProduct(pid, uid).then((response)=>{
            if(response)
            {
                let deleted=true
                res.json(deleted)
            }else{
                let deleted=false
                res.json(deleted)
            }
            
        })
    },
}