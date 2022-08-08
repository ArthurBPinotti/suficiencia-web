const router = require("express").Router();
const comandas = require("../controllers/comandasControllers");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth(), comandas.create);
router.put("/:id", auth(), comandas.update);
router.get("/:id", auth(), comandas.getOne);
router.get("/", auth(), comandas.getAll);
router.delete("/:id", auth(), comandas.deleteComanda);

module.exports = router;