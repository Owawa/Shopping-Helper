const express = require("express");
const router = express.Router();
const { 
    getAllPopulatedHistory,
    createHistory,
    updateHistory,
    deleteHistory,
    getAllRawHistory
} = require("../controllers/histories");

router.get("/", getAllPopulatedHistory);
router.post("/", createHistory);
router.patch("/:id", updateHistory);
router.delete("/:id", deleteHistory);

router.get("/raw", getAllRawHistory)

module.exports = router;