// let userHelpers = require('../../helpers/user-helpers')
const userHelpers = require('../../helpers/userHelper')
const checking = require('../../checking/userBlock')
const { ObjectId } = require('mongodb')

module.exports = {

    getSignUp: (req, res) => {

        userdata = req.session.userDetails
        res.render('user/signup', { userdata })
    },



    postSignup: (req, res) => {

        return new Promise((resolve, reject) => {

            userHelpers.signupData(req.body).then((data) => {

                userId = data.insertedId
                userHelpers.createWallet(userId).then((response) => {


                    res.redirect('/login')
                })

            })
        })

    },


    getLogin: (req, res) => {

        let userdata = req.session.userDetails

        let loginErr = req.session.loginErr
        let userBlocked = req.session.userBlocked
        req.session.loginErr = false
        req.session.userBlocked = false

        res.render('user/login', { userdata, loginErr, userBlocked })
    },


    getLogout: (req, res) => {

        req.session.user = false
        req.session.userDetails = null
        res.redirect('/login')
    },


    // postLogin: (req, res) => {

    //     return new Promise(async(resolve, reject) => {



    //         userHelpers.loginData(req.body).then((result) => {

    //             if (result) {
    //                 console.log('resulteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    //                 console.log(result)

    //                 checking.userBlock(result.email).then((data) => {

    //                     if (data) {

    //                         req.session.userBlocked=true
    //                         console.log("user blocked,you can't login");
    //                         res.redirect('/login')
    //                     } else {

    //                         let a = userHelpers.getCartProducts(result._id).then((cartProducts)=>{

    //                             if(cartProducts)
    //                             {
    //                                 console.log(cartProducts)
    //                                 cartCount=cartProducts.length
    //                                 console.log('cart count',cartCount)                                    
    //                                 return cartCount

    //                             }

    //                         })  
    //                             let b=userHelpers.getAllWishlistProducts(result._id).then((wishlistProducts)=>{

    //                                 if(wishlistProducts)
    //                                 {
    //                                     console.log(wishlistProducts)
    //                                     wishlistCount=wishlistProducts.length
    //                                     console.log('wihslist count',wishlistCount)
    //                                     return wishlistCount
    //                                 }

    //                             })


    //                         console.log('cart count',a)
    //                         console.log('wishlcount',b)
    //                         req.session.loginErr=false
    //                         req.session.userBlocked=false
    //                         req.session.user = true
    //                         req.session.userDetails = result
    //                         req.session.userDetails.wishlistCount=b
    //                         req.session.userDetails.cartCount=a
    //                         console.log('checking allll');
    //                         console.log(req.session.userDetails)

    //                         res.redirect('/')

    //                     }
    //                 })
    //             } else {

    //                 req.session.loginErr=true
    //                 req.session.userBlocked=false
    //                 req.session.user = false
    //                 res.redirect('/login')

    //             }

    //         })
    //     })
    // },


    postLogin: (req, res) => {

        return new Promise((resolve, reject) => {

            userHelpers.loginData(req.body).then((result) => {

                if (result) {


                    checking.userBlock(result.email).then((data) => {

                        if (data) {

                            req.session.userBlocked = true;
                            console.log("user blocked, you can't login");
                            res.redirect('/login');


                        } else {


                            let a = userHelpers.getCartProducts(result._id).then((cartProducts) => {

                                if (cartProducts) {

                                    console.log(cartProducts);
                                    cartCount = cartProducts.length;
                                    console.log('cart count', cartCount);
                                    return cartCount;


                                }
                            });

                            let b = userHelpers.getAllWishlistProducts(result._id).then((wishlistProducts) => {


                                if (wishlistProducts) {

                                    console.log(wishlistProducts);
                                    wishlistCount = wishlistProducts.length;
                                    console.log('wishlist count', wishlistCount);
                                    return wishlistCount;


                                }
                            });

                            Promise.all([a, b]).then(([cartCount, wishlistCount]) => {
                                console.log('cart count', cartCount);
                                console.log('wishlist count', wishlistCount);

                                req.session.loginErr = false;
                                req.session.userBlocked = false;
                                req.session.user = true;
                                req.session.userDetails = result;
                                req.session.userDetails.wishlistCount = wishlistCount;
                                req.session.userDetails.cartCount = cartCount;

                                console.log('checking allll');
                                console.log(req.session.userDetails);

                                res.redirect('/');
                            });
                        }
                    });
                } else {

                    req.session.loginErr = true
                    req.session.userBlocked = false
                    req.session.user = false
                    res.redirect('/login')

                }
            });
        });
    },

    getUserProfile: (req, res) => {

        let userdata = req.session.userDetails
        let uid = req.session.userDetails._id

        userHelpers.getAllOrders(uid).then((orders) => {


            userHelpers.getUserAddress(uid).then((address) => {

                console.log(orders);


                res.render('user/userProfile', { userdata, orders, address })

            })



        })




    },
    getChangePassword: (req, res) => {

        let userdata = req.session.userDetails
        notupdated = req.session.notupdated
        req.session.notupdated = false
        res.render('user/currentPassword', { userdata, notupdated })

    },
    checkCurrentPassword: (req, res) => {

        let userId = req.session.userDetails._id
        let userdata = req.session.userDetails
        userHelpers.passwordChecking(userId, req.body).then((response) => {
            if (response) {
                res.render('user/newPassword', { userdata })
            } else {
                req.session.notupdated = true
                res.redirect('/changePassword')
            }
        })
    },
    updatePassword: (req, res) => {

        let uid = req.session.userDetails._id
        let newPassword = req.body.password
        userHelpers.updatePassword(uid, newPassword).then((response) => {

            res.redirect('/')
        })
    },
    removeUser: (req, res) => {

        previousUrl = req.header('Referer')
        let uid = req.params.id
        userHelpers.removeUser(uid).then((response) => {

            res.redirect(previousUrl)
        })
    },
    contact:(req,res)=>{
        
        let userdata=req.session.userDetails
        res.render('user/contact',{userdata})
    }
}