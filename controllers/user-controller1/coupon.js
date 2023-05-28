// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')



module.exports={
    postApplyCoupon:(req,res)=>{

        const previousUrl = req.header('Referer');

        let total=req.body.total
        let couponCode=req.body.code
        let currentDate=new Date()
        let temp=0
        let discountAmount=0
        console.log('coupon body',req.body)
        userHelpers.checkCoupenExist(couponCode).then((response)=>{
           if(response)
           {

            expiryDate= new Date(response.expiryDate)
           

            req.session.minimumPurchaseAmount=response.minimumPurchasingAmount

            if(expiryDate.getTime()<currentDate.getTime())
            {
                console.log('coupon expired')
                req.session.expire=true
                
                res.redirect(previousUrl)

            }else{

                console.log('coupen is valid')

                console.log('minimun purchasing amount',response.minimumPurchasingAmount)
                if(Number(total)>Number(response.minimumPurchasingAmount))
                {
                    

                // exmaple:- find the 15 percentage of 50000 (15/100)=0.15 ---0.15*50000
                temp=Number(response.discount)/100
                discountAmount=Number(temp)*Number(total)
                console.log(discountAmount)

                if(Number(discountAmount)>Number(response.limitAmount))
                {
                    discountAmount=Number(response.limitAmount)

                    total=Number(total)-Number(discountAmount)

                    console.log('limitamount=discountamountyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                    console.log(total)
                    
                    couponTotal=total
                    req.session.coupon=couponTotal
                    console.log('coupontotal',couponTotal)

                    req.session.couponCodeErr=false
                    req.session.minimumPurchase =false 

                    req.session.expire=false

                    res.redirect(previousUrl)


                }else{

                    total=total-discountAmount
                    console.log('total')
                    console.log(total)
                    couponTotal=total
                    req.session.coupon=couponTotal

                    req.session.couponCodeErr=false
                    req.session.minimumPurchase =false 

                    req.session.expire=false
                    res.redirect(previousUrl)

                }

                }
                else
                {
                    req.session.couponCodeErr=false
                    req.session.minimumPurchase =true 
                    req.session.expire=false
                    console.log('sorry your purchase is not enough , please purchase then minums Amount')
                    res.redirect(previousUrl)
                }
                
            }
           }else{
            console.log('the coupen code is not exisiting')
             
            req.session.minimumPurchase =false 
            req.session.couponCodeErr=true
            req.session.expire=false

            res.redirect(previousUrl)
           }

        })
    },
    getRemoveCoupon:(req,res)=>{


        const previousUrl=req.header('Referer')
        req.session.coupon=null
        res.redirect(previousUrl)
        
    },

}