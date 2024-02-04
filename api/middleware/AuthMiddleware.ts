const { expressjwt: jwt } = require("express-jwt");
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });
