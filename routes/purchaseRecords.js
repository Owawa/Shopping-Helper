const express = require("express");
const router = express.Router();
const { 
    getAllPurchaseRecords,
    createPurchaseRecord,
    updatePurchaseRecord,
    deletePurchaseRecord,
    getAllRawPurchaseRecords
} = require("../controllers/purchaseRecords");

router.get("/", getAllPurchaseRecords);
router.post("/", createPurchaseRecord);
router.patch("/:id", updatePurchaseRecord);
router.delete("/:id", deletePurchaseRecord);

router.get("/raw", getAllRawPurchaseRecords)

module.exports = router;