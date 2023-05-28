// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports = {

    getCheckout: (req, res) => {


        let userdata = req.session.userDetails

        let uid = req.params.id

        userHelpers.getCartProducts(uid).then((cartData) => {

            userHelpers.getUserAddress(uid).then((userAddress) => {

                userHelpers.getCartTotal(uid).then((cartTotal) => {

                     total=cartTotal[0].cartTotal
                    

                    coupon = req.session.coupon


                    couponCodeErr = req.session.couponCodeErr
                    req.session.couponCodeErr = false

                    minimumPurchase = req.session.minimumPurchase
                    req.session.minimumPurchase = false

                    minimumPurchaseAmount = req.session.minimumPurchaseAmount
                    req.session.minimumPurchaseAmount = false

                    expired = req.session.expire
                    req.session.expire = false


                    res.render('user/checkout', { userdata, total, cartData, userAddress, coupon, couponCodeErr, minimumPurchase, minimumPurchaseAmount, expired })

                })

            })


        })

    },

}