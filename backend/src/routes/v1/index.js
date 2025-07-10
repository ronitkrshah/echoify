const router = require('express').Router()
const musicRouter = require("./music")

router.use("/music", musicRouter)

module.exports = router