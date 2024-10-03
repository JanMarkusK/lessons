import React, { useState, useEffect } from "react";
import { Box, List, ListItem, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Paper, ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import SubmitCat from "./SubmitCat";

let theme = createTheme({
  palette: {
    primary: {
      main: '#a037ef',
    },
    secondary: {
      main: '#ef37e3',
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

// Define the Cat type
type Cat = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number | null;
  deleted: boolean;
};

const Cats = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [newName, setNewName] = useState("");

  const fetchCats = async () => {
    const response = await fetch("http://localhost:8080/cats");
    const data = await response.json();
    setCats(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  // DELETE cat function
  const deleteCat = async (id: string) => {
    await fetch(`http://localhost:8080/cats/${id}`, {
      method: "DELETE",
    });
    fetchCats();
  };

  // OPEN edit dialog for renaming cat
  const openEditCatDialog = (cat: Cat) => {
    setSelectedCat(cat);
    setNewName(cat.name);
    setOpenEditDialog(true);
  };

  // CLOSE edit dialog
  const closeEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedCat(null);
  };

  // UPDATE cat name function
  const updateCatName = async () => {
    if (selectedCat && newName.trim() !== "") {
      await fetch(`http://localhost:8080/cats/${selectedCat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      fetchCats();
      closeEditDialog();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Cats
        </Typography>
        <List>
          {cats.map((cat) => (
            <ListItem key={cat.id}>
              <Paper elevation={3} sx={{ padding: 2, width: "100%" }}>
                <Grid container spacing={2}>
                  {/* Cat Name */}
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6" color="primary">
                      {cat.name}
                    </Typography>
                  </Grid>

                  {/* Cat Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>ID:</strong> {cat.id}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Created At:</strong>{" "}
                      {new Date(cat.createdAt).toLocaleString()}
                    </Typography>
                    {cat.updatedAt && (
                      <Typography variant="body1">
                        <strong>Updated At:</strong>{" "}
                        {new Date(cat.updatedAt).toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Deleted:</strong> {cat.deleted ? "Yes" : "No"}
                    </Typography>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openEditCatDialog(cat)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteCat(cat.id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </ListItem>
          ))}
        </List>

        {/* Submit new cat component */}
        <SubmitCat fetchCats={fetchCats} />

        {/* Edit Cat Dialog */}
        <Dialog open={openEditDialog} onClose={closeEditDialog}>
          <DialogTitle>Edit Cat Name</DialogTitle>
          <DialogContent>
            <TextField
              label="New Name"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={updateCatName} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Cats;