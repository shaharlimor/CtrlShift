const express = require("express");
const userController = require("../controllers/users");
const middleware = require("../common/auth_middleware");
const multer = require("multer");
var router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024, // 500 KB
  },
});

router.post("/delete/:id", middleware, userController.deleteUser);
router.post("/create", middleware, userController.createUser);
router.post("/update/:id", middleware, userController.updateUser);
router.get("/users", middleware, userController.getAllUsersByOrganization);
router.post(
  "/changeImage",
  middleware,
  upload.single("image"),
  userController.changeImage
);
router.post("/changePassword", middleware, userController.changePassword);

router.get("/getEmployeesDetails/:ids", async (req, res) => {
  try {
    console.log(req.params.ids);
    const idsSplitted = req.params.ids.split(",");
    const ans = await userController.getEmployeesDetails(idsSplitted);
    res.send(ans);
  } catch (err) {
    res.send("error get employess details: " + err);
  }
});

module.exports = router;
