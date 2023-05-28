// let userHelpers = require('../../helpers/user-helpers')
let userHelpers = require('../../helpers/userHelper')


module.exports={


    otpLogin: (req, res) => {

        let badnumber = req.session.badnumber
        req.session.badnumber = false

        res.render('user/phNumber', { badnumber })
    },
    checkNumber: (req, res) => {

        console.log('helo')

        userHelpers.checkNumber(req.body.phone).then((response) => {
            if (!response.err) {

                let name = response.name
                req.session.phone = response.phone
                req.session.userDetails = response.data

                res.render('user/otp', { name })
            }
            else {

                req.session.badnumber = true

                res.redirect('/otplogin')
            }

        })

    },
    postCheckOtp: (req, res) => {

        let phone = req.session.phone
        let otp = req.body.otp

        userHelpers.checkOtp(otp, phone).then((response) => {

            if (!response.err) {

                req.session.user = true
                res.redirect('/')

            }
            else {
                req.session.user = false
                res.redirect('/checkotp')
            }

        })
    },
    getCheckOtp: (req, res) => {

        res.render('user/otp')
    },
}