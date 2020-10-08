const router = require('express').Router();
const userValidator = require('../validators/userValidator');
const services = require('../services/userServices');
console.log("userRoutes....................");


//Signup

router.post('/signup', userValidator.signupReqValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignup(payLoad);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signup successful",
                    data: newData.userData
                })
            } else if (newData.findData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Email already exists",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User already registered",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Signup unsuccessful",
                data: {}
            })
        }

    })

//Signin

router.post('/signin', userValidator.signinReqValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignIn(payLoad);
            console.log(newData)
            console.log(newData.data)
            if (newData.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "SignIn successful",
                    data: newData.userInfo
                })
            } else if (!newData.data) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User not found",
                    data: {}
                })
            } else if (!newData.isPasswordValid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Incorrect password",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Signin unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Signin unsuccessful",
                data: {}
            })
        }

    })


//User Logout

router.post('/logout',
    async(req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.userLogout(token);
            if (data) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Logout successful",
                    data: data
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Logout unsuccessful",
                    data: data
                })
            }
        } catch (error) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access token is not correct",
                data: {}
            })
        }
    })

module.exports = router;