const { Router } = require("express");
const router = Router();

const availabilityController = require("../controllers/availability-controller");

router.get('/parking',(rep, res) => {
    res.render('parking');
});

router.post("/availability", availabilityController.searchPlate);
router.get('/list', availabilityController.list);

module.exports = router;
