// TODO-de middleware
const todosRouteMiddleware = (req, res, next) => {
   console.log("Handling TODO route at time: ", Date.now());
   next();
 };
 
 const todosGetRouteMiddleware = (req, res, next) => {
   console.log("TODO GET middleware");
   next();
 };
 
 module.exports = { todosRouteMiddleware, todosGetRouteMiddleware };