const express = require("express");
const router = express.Router();

const {
    getAllItems,
    createItem,
    deleteItem,
    getSingleItem,
    updateItem
} = require("../controllers/items");

router.get("/", getAllItems);
router.get("/:id", getSingleItem);
router.post("/", createItem);
router.patch("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;