const express = require("express");
const router = express.Router();
const { 
    getAllPurchaseRecords,
    createPurchaseRecord,
    updatePurchaseRecord,
    deletePurchaseRecord,
} = require("../controllers/purchaseRecords");

router.get("/", getAllPurchaseRecords);
router.post("/", createPurchaseRecord);
router.patch("/:id", updatePurchaseRecord);
router.delete("/:id", deletePurchaseRecord);

module.exports = router;