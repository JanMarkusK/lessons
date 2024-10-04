const express = require("express");
const router = express.Router();
const todosController = require("../controllers/todos.controller");
const {
  todosRouteMiddleware,
  todosGetRouteMiddleware,
} = require("../middlewares/todos.middlewares");

// Üldine route middleware
router.use(todosRouteMiddleware);

//JWT routeid
router.get("/token", todosController.getToken);
router.post("/verify", todosController.verifyToken);

//Todo routeid
router.get("/", todosGetRouteMiddleware, todosController.read);
router.post("/", todosController.create, query("title").notEmpty(),(req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return res.send(`Forgot title, ${req.query.title}!`);
    }

    res.send({ errors: result.array() });
});

router.put("/:id", todosController.update, query("title").notEmpty(),(req, res) => {
   const result = validationResult(req);
   if (result.isEmpty()) {
     return res.send(`Forgot title, ${req.query.title}!`);
   }

   res.send({ errors: result.array() });
});
router.delete("/:id", todosController.delete);

module.exports = router;
