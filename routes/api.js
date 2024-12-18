var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var fs = require("fs");

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.json({ limit: "100mb" }));
router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Import 
var { RegisterRoutes, getUsersRoutes, UserRemoveRoutes, UserUpdateRoutes, LoginRoutes, UserUpdateRoutes,
    changePasswordRoutes,
    PdfRouter,
    sendPDFToREACTRoutes,
} = require("../User/UserFunctions");
// const { RegisterOfficialDetailsRoutes, GetOfficialDetailsRoutes } = require("../Employee/employeeDataFunction");

// passing router in the function which is nothing but route
//User
RegisterRoutes(router);
getUsersRoutes(router);
UserRemoveRoutes(router);
UserUpdateRoutes(router);
LoginRoutes(router);
changePasswordRoutes(router);
// RegisterOfficialDetailsRoutes(router)
// GetOfficialDetailsRoutes(router)
PdfRouter(router)
sendPDFToREACTRoutes(router)

// export
module.exports = router;
