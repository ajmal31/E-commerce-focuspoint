// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports = {
    postPlaceOrder: (req, res) => {

        const previousUrl = req.header('Referer');
        console.log('place order details ')
        console.log(req.body);
        let addressId = req.body.address
        let totalAmount = req.body.amount
        let uid = req.session.userDetails._id
        let payment = req.body.payment_mode
        let walletChecking = 0
        console.log('pament method')
        console.log(payment)

        if (addressId == null) {
            res.redirect(previousUrl)

        }
        else if (payment === 'wallet') {

            userHelpers.finduserWallet(uid).then((response) => {

                console.log('wallet amount', response.walletAmount)
                walletUpdateAmount = response.walletAmount - Number(totalAmount)

                console.log('walletcheking')
                console.log(walletUpdateAmount)
                if (walletUpdateAmount > 0) {
                    userHelpers.getCartProducts(uid).then((cartProducts) => {

                        userHelpers.getUserSpecificAddress(addressId).then((userAddress) => {



                            userHelpers.placeOrder(cartProducts, userAddress, uid, totalAmount, payment).then((orderId) => {
                                if (orderId) {

                                    //Order Details inserted in the order collection after clearing the user cart

                                    userHelpers.removeCartData(uid).then((remove) => {
                                        if (remove) {

                                            userHelpers.updateWalletAmount(uid, walletUpdateAmount).then((response) => {

                                                res.json({ status: true })

                                            })




                                        }
                                    })

                                }


                            })


                        })

                    })

                } else {
                    console.log('wallet balance not enough this yui')
                    res.redirect('/cart')

                }
            })

        }
        else {

            
            if(payment==='razorpay'&&totalAmount>=500000)
                   {
                     let obj1={
                        amountExceed:true
                     }
                     

                     res.json(obj1)
                   }else{

                   
            userHelpers.getCartProducts(uid).then((cartProducts) => {

                userHelpers.getUserSpecificAddress(addressId).then((userAddress) => {

                   

                   


                    userHelpers.placeOrder(cartProducts, userAddress, uid, totalAmount, payment).then((orderId) => {
                        if (orderId) {

                            //Order Details inserted in the order collection after clearing the user cart

                            userHelpers.removeCartData(uid).then((remove) => {
                                if (remove) {



                                    if (payment === 'razorpay') {
                                        userHelpers.generateRazorpay(orderId, totalAmount).then((order) => {

                                            // userHelpers.changePaymentStatus(orderId).then((response) => {

                                                console.log('ordeeeeeeeeeeeeeeeeeeeeeeeeeeeeereeeeeeeeeeeee',orderId)
                                                console.log(order)
                                                console.log("order")
                                                req.session.coupon = null
                                                res.json({ order: order, status: false })
                                            // })


                                        });
                                    } else {

                                        res.json({ status: true })


                                    }



                                }
                            })

                        }


                    })


                })

            })
        } 

        }






    },
    // getAllOrders: (req, res) => {

    //     let uid = req.session.userDetails._id

    //     userHelpers.getAllOrders(uid).then((allOrders) => {

    //         if (allOrders) {
    //             console.log('all orders')
    //             console.log(allOrders);
    //             console.log('order geting successfull');
    //            let userdata = req.session.userDetails
    //             res.render('user/orders', { userdata, allOrders })
    //         }


    //     })
    // },
    getViewmore: (req, res) => {

        let id = req.params.id
        userHelpers.getOneOrder(id).then((orders) => {


            products = orders.products
            address = orders.address
            total = orders.total_amount
            orderStatus = orders.order_status
            console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            console.log(products)
            console.log(address)
            console.log(total)


            let userdata = req.session.userDetails
            res.render('user/orderProductDetails', { userdata, products, address, total, id, orderStatus })


        })
    },
    getOrderSuccess: (req, res) => {


        let userdata = req.session.userDetails
        res.render('user/orderSuccess', { userdata })
    },
    getCancelOrder: (req, res) => {

        previousUrl = req.header('Referer')

        let oid = req.params.id
        let uid = req.session.userDetails._id
        userHelpers.cancelOrder(oid).then((response) => {

            userHelpers.getOneOrder(oid).then((response) => {


                if (response.payment_status === 'succeed') {
                    walletAmount = Number(response.total_amount)

                    userHelpers.addToWallet(uid, walletAmount).then((response) => {
                        res.redirect(previousUrl)

                    })
                } else {

                    res.redirect(previousUrl)
                }
            })



        })
    },
    getReturnOrder: (req, res) => {

        previousUrl = req.header('Referer')

        let oid = req.params.id
        let uid = req.session.userDetails._id
        userHelpers.returnOrder(oid).then((response) => {

            userHelpers.getOneOrder(oid).then((response) => {

                walletAmount = Number(response.total_amount)
                userHelpers.addToWallet(uid, walletAmount).then((response) => {
                    res.redirect(previousUrl)

                })
            })




        })
    },

}