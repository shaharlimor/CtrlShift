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
router.post("/update", middleware, userController.updateUser);
router.get("/users", middleware, userController.getAllUsersByOrganization);
router.post(
  "/changeImage",
  middleware,
  upload.single("image"),
  userController.changeImage
);
router.post("/changePassword", middleware, userController.changePassword);

router.get("/getEmployeesDetails/:ids", middleware, async (req, res) => {
  try {
    const idsSplitted = req.params.ids.split(",");
    const ans = await userController.getEmployeesDetails(idsSplitted);
    res.send(ans);
  } catch (err) {
    res.send("error get employess details: " + err);
  }
});

router.get("/orgExist/:name", async (req, res) => {
  try {
    const ans = await userController.organizationExist(req.params.name);
    res.send(ans);
  } catch (err) {
    res.send("error to check if organization already exists: " + err);
  }
});

module.exports = router;
