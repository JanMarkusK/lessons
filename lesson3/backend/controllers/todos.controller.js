const todos = [
   {
     id: "1",
     title: "Complete project",
     priority: 1,
     createdAt: Date.now(),
     updatedAt: null,
     deleted: false
   }
 ];
 
 exports.create = (req, res) => {
   const { title, priority } = req.body;
 
   if (!title || !priority) {
     return res
       .status(418)
       .send({ type: "Error", message: "Title and priority are required" });
   }
 
   const newTodo = {
     id: crypto.randomUUID(),
     title: title,
     priority: priority,
     createdAt: Date.now(),
     updatedAt: null,
     deleted: false,
   };
 
   todos.push(newTodo);
   res.send(newTodo);
 };
 
 exports.read = (req, res) => {
   const activeTodos = todos.filter(todo => !todo.deleted);
   res.send(activeTodos);
 };
 
 exports.update = (req, res) => {
   const { id } = req.params;
   const { title, priority } = req.body;
 
   const todo = todos.find(todo => todo.id === id);
 
   if (!todo) {
     return res.status(404).send({ message: "Todo not found" });
   }
 
   todo.title = title || todo.title;
   todo.priority = priority || todo.priority;
   todo.updatedAt = Date.now();
 
   res.send(todo);
 };
 
 exports.delete = (req, res) => {
   const { id } = req.params;
 
   const todo = todos.find(todo => todo.id === id);
 
   if (!todo) {
     return res.status(404).send({ message: "Todo not found" });
   }
 
   todo.deleted = true;
   todo.updatedAt = Date.now();
 
   res.send({ message: "Todo deleted" });
 };