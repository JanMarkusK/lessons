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
router.get('/token', todosController.getToken); 
router.post('/verify', todosController.verifyToken); 

//Todo routeid
router.get("/", todosGetRouteMiddleware, todosController.read);
router.post("/", todosController.create);
router.put("/:id", todosController.update);
router.delete("/:id", todosController.delete);

module.exports = router;
