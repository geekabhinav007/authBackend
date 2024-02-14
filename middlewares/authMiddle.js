const jwt = require('jsonwebtoken')
require('dotenv').config()

//auth, isCustomer, isAdmin


exports.auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;  //  || req.cookies.token
        // console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            });
        }

        // Manual function to remove Bearer from token
        const extractTokenFromHeader = (authorizationHeader) => {
            // Check if the header starts with "Bearer"
            if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
                // Remove the "Bearer " prefix
                return authorizationHeader.slice(7);
            }
            // If the header doesn't start with "Bearer", return it as is
            return authorizationHeader;
        };


        // try {
        //     const decodedToken = jwt.decode(token, { complete: true });
        //     console.log("Decoded Token:", decodedToken);
        // } catch (error) {
        //     console.error("Token Decoding Error:", error);
        // }
        // console.log(token);

        // console.log(token);

        try {

            token = extractTokenFromHeader(token);
            // console.log(process.env.JWT_SECRET)
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { complete: true });
            // console.log("Decoded Token:", decodedToken);
            req.user = decodedToken.payload;
            console.log("Decoded User:", req.user);
            next();
        } catch (error) {
            console.error("Token Verification Error:", error);
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
                error: error.message,
            });
        }
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({
            success: false,
            message: "Error Occurred in Authentication",
        });
    }
};




exports.isCustomer = (req, res, next) => {
    try {
        console.log(req.user)
        if (req.user.role !== "Customer") {
            return res.status(401).json({
                success: false,
                message: "You are not authorized Customer"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something error occured: " + error
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "You are not authorized Admin"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something error occured: " + error
        })
    }
}