import {
  Box,
  List,
  ListItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SubmitTodo from "./SubmitTodos";
import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#a037ef",
    },
    secondary: {
      main: "#ef37e3",
    },
  },
});

type Todo = {
  id: string;
  title: string;
  priority: number;
  createdAt: number;
  updatedAt: number | null;
  deleted: boolean;
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8080/todos");
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // DELETE todo function
  const deleteTodo = async (id: string) => {
    await fetch(`http://localhost:8080/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  // OPEN edit dialog for renaming todo
  const openEditTodoDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setNewTitle(todo.title);
    setOpenEditDialog(true);
  };

  // CLOSE edit dialog
  const closeEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedTodo(null);
  };

  // UPDATE todo title function
  const updateTodoTitle = async () => {
    if (selectedTodo && newTitle.trim() !== "") {
      await fetch(`http://localhost:8080/todos/${selectedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });
      fetchTodos();
      closeEditDialog();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Todos
        </Typography>
        <List>
          {todos.map((todo) => (
            <ListItem key={todo.id}>
              <Paper elevation={3} sx={{ padding: 2, width: "100%" }}>
                <Grid container spacing={2}>
                  {/* Todo Title */}
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6" color="primary">
                      {todo.title}
                    </Typography>
                  </Grid>

                  {/* Todo Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>ID:</strong> {todo.id}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Priority:</strong> {todo.priority}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Created At:</strong>{" "}
                      {new Date(todo.createdAt).toLocaleString()}
                    </Typography>
                    {todo.updatedAt && (
                      <Typography variant="body1">
                        <strong>Updated At:</strong>{" "}
                        {new Date(todo.updatedAt).toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Deleted:</strong> {todo.deleted ? "Yes" : "No"}
                    </Typography>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {/* Edit Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openEditTodoDialog(todo)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    {/* Delete Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </ListItem>
          ))}
        </List>

        {/* Submit new todo component */}
        <SubmitTodo fetchTodos={fetchTodos} />

        {/* Edit Todo Dialog */}
        <Dialog open={openEditDialog} onClose={closeEditDialog}>
          <DialogTitle>Edit Todo Title</DialogTitle>
          <DialogContent>
            <TextField
              label="New Title"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={updateTodoTitle} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Todos;
