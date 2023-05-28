

///after controllers spliting modification please remind

var express = require('express');
var router = express.Router();
const auth=require('../auth/userAuth')
//after requiring
const users=require('../controllers/user-controller1/user')
const address=require('../controllers/user-controller1/address')
const cart=require('../controllers/user-controller1/cart')
const checkout=require('../controllers/user-controller1/checkout')
const coupon=require('../controllers/user-controller1/coupon')
const orders=require('../controllers/user-controller1/orders')
const otp=require('../controllers/user-controller1/otp')
const payment=require('../controllers/user-controller1/payment')
const products=require('../controllers/user-controller1/product')
const wallet=require('../controllers/user-controller1/wallet')
const wishlist=require('../controllers/user-controller1/wishlist');


/* GET users listing. */

//get signup page
router.get('/signUp',users.getSignUp)

//get home page
router.get('/',products.getHome)

//post sighnup details
 router.post('/signupDetails',users.postSignup)

// get login
router.get('/login',users.getLogin)

//GET LOGOUT
router.get('/logout',users.getLogout)

//post login
router.post('/loginDetails',users.postLogin)

//GET LOGOUT
router.get('/logout',users.getLogout)       

//GET CART PAGE
router.get('/cart',auth.userAuthentication,cart.getCart)

// GET otp login
router.get('/otplogin',otp.otpLogin)

// POST CHECK NUMBER
router.post('/checknumber',otp.checkNumber)

//GET OTP PAGE
router.get('checkotp',otp.getCheckOtp)

// POST CHECK OTP
router.post('/checkotp',otp.postCheckOtp)

//GET PRODUCTS BASED CATEGORY
router.get('/shop/:id',products.getShop)

//GET ADD TO CART
router.get('/addToCart/:id', auth.userAuthentication,cart.addToCart )

//VIEW PRODUCT DETAILS
router.get('/productDetails/:id',products.viewProductDetails)

//GET CHECK OUT
router.get('/checkout/:id',auth.userAuthentication ,checkout.getCheckout)

// //GET FORGOT PASSWORD
// router.get('/forgotPassword',userController.getForgotPassword)

//CHANGE CART COUNT
router.post('/cartCountUpdate',auth.userAuthentication,cart.postCartCount)

//REMOVE PRODUCT IN CART
router.post('/removeProduct',cart.getRemoveCartProduct)

//GET ALL PRODUCTS
router.get('/getAllProducts',products.getAllProducts)

//GET ALL PRODUCTS IN WISH LIST
router.get('/getAllwishlistProducts',auth.userAuthentication,wishlist.getAllWishListProducts)

//ADD WISH LIST
router.get('/addWishList/:id',auth.userAuthentication,wishlist.addWishList )


//GET USER PROFILE

router.get('/userProfile',auth.userAuthentication,users.getUserProfile)

// POST ADD ADDRESS
router.post('/addAddress',auth.userAuthentication , address.postAddAddress)

//POST PLACE ORDER 
router.post('/placeOrder',auth.userAuthentication,orders.postPlaceOrder)

// //GET ALL ORDERS
// router.get('/getAllOrders',auth.userAuthentication, orders.getAllOrders)

//VIEW MORE
router.get('/viewmore/:id',auth.userAuthentication, orders.getViewmore)


//DELETE ADDRESS
router.get('/deleteAddress/:id', auth.userAuthentication, address.getDeleteAddress)

router.get('/orderSuccess',auth.userAuthentication,orders.getOrderSuccess)

//VERIFYPAYMENT
router.post('/verifyPayment',auth.userAuthentication, payment.postVerifyPayment)

//COUPON APPLYING
router.post('/applyCoupon', auth.userAuthentication, coupon.postApplyCoupon )

router.get('/removeCoupon',auth.userAuthentication, coupon.getRemoveCoupon)


//CANCELORDER
router.get('/cancelOrder/:id',auth.userAuthentication,orders.getCancelOrder)

//RETURN OERDER
router.get('/returnOrder/:id',auth.userAuthentication,orders.getReturnOrder)


router.get('/wallet',auth.userAuthentication,wallet.getWallet)

//CHANGE PASSWORD REQUESTIN
router.get('/changePassword',auth.userAuthentication,users.getChangePassword)

//POST CHANGE PASSWORD
router.post('/checkCurrentPassword',auth.userAuthentication,users.checkCurrentPassword)

//UPDATE PASSWORD
router.post('/updatePassword',auth.userAuthentication,users.updatePassword)


router.get('/removeWishProduct/:id',auth.userAuthentication,wishlist.removeProduct)


//REMOVE USER
router.get('/removeUser/:id',auth.userAuthentication,users.removeUser)

//CONTACT
router.get('/contact',users.contact)
// router.get('/test-home',(req,res)=>{
//     adminHelpers.getAllCategories().then((data)=>{
//         let userdata=req.session.userDetails
//         res.render('user/home-tes',{data,userdata})
//     })

// })


module.exports = router;

