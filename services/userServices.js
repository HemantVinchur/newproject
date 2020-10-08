const functions = require('../function');
const user = require('../models/user');
const userAuth = require('../models/userAuth');
const jwt = require('jsonwebtoken');
//......................................................User onboard started.................................................................................................................................................................................................................................................



const userSignup = async(payLoad) => {
    try {
        console.log(payLoad)
        let findData = await user.findOne({ email: payLoad.email });
        console.log(findData);
        if (payLoad.password == payLoad.confirmPassword) {
            let hashObj = functions.hashPassword(payLoad.password);
            console.log(hashObj);
            delete payLoad.password;
            payLoad.salt = hashObj.salt;
            payLoad.password = hashObj.hash;
        }
        if (!findData) {
            var userData = await user.create(payLoad);
            console.log(userData)
        } else {
            console.log("User already signup")
        }
        console.log(userData)
        return { userData, findData };
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Signin:-

const userSignIn = async(payLoad) => {

    try {
        let data = await user.findOne({ email: payLoad.email });
        let authData = await userAuth.findOne({ email: payLoad.email });
        console.log(data)
        if (!data) {
            console.log("User not found");
        } else {
            var isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
            console.log(isPasswordValid)
        }
        if (!isPasswordValid) {
            console.log("Incorrect password")
        } else if (authData) {
            console.log("Access token is already created.")
            var userInfo = { email: data.email, accessToken: authData.accessToken }
        } else {
            let token = jwt.sign({ email: payLoad.email }, 's3cr3t');
            console.log("Token-:", token)
            var userData = await userAuth.create({ email: payLoad.email, accessToken: token });
            var userInfo = { email: data.email, accessToken: userData.accessToken }
        }
        return { data, isPasswordValid, userInfo, authData }
    } catch (error) {
        console.log(error)
        throw error
    }
}

//User Logout

const userLogout = async(token) => {
    try {
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            console.log("Access token not found")
        }
        token.accessToken = decodeCode.accessToken;
        let deletetoken = await userAuth.deleteOne(token.accessToken);
        return deletetoken;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//..................................................User onboard complete..........................................................................................
module.exports = { userSignup, userSignIn, userLogout }