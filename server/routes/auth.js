const userController = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/allusers/:id", userController.getAllUsers);
router.post("/setavatar/:id", userController.setAvatar);
router.get("/logout/:id", userController.logout);
router.patch("/update/:id", userController.updateProfile);

module.exports = router;
