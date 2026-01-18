import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import AddBook from './AddBook';
import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [books, setBooks] = useState([]);

  const FIREBASE_URL = 'https://bookstore-b02a5-default-rtdb.europe-west1.firebasedatabase.app/books';

  const [colDefs, setColDefs] = useState([
    { field: 'title', headerName: 'Title', sortable: true, filter: true, flex: 1 },
    { field: 'author', headerName: 'Author', sortable: true, filter: true, flex: 1 },
    { field: 'year', headerName: 'Year', sortable: true, filter: true, width: 100 },
    { field: 'isbn', headerName: 'Isbn', sortable: true, filter: true, flex: 1 },
    { field: 'price', headerName: 'Price', sortable: true, filter: true, width: 100 },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    }
  ]);

  useEffect(() => {
    fetchBooks();
  },
    [])

  const fetchBooks = () => {
    fetch(`${FIREBASE_URL}.json`)
      .then(response => response.json())
      .then(data => addKeys(data))
      .catch(err => console.error(err))
  }

  // Add keys to the book objects
  const addKeys = (data) => {
    if (data) {
      const keys = Object.keys(data);
      const valueKeys = Object.values(data).map((item, index) =>
        Object.defineProperty(item, 'id', { value: keys[index] }));
      setBooks(valueKeys);
    } else {
      setBooks([]);
    }
  }

  const addBook = (newBook) => {
    fetch(`${FIREBASE_URL}.json`,
      {
        method: 'POST',
        body: JSON.stringify(newBook)
      })
      .then(response => fetchBooks())
      .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`${FIREBASE_URL}/${id}.json`,
      {
        method: 'DELETE',
      })
      .then(response => fetchBooks())
      .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={2} mb={2}>
        <AddBook addBook={addBook} />
      </Stack>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%', margin: 'auto' }}>
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
          rowHeight={60}
        />
      </div>
    </div>
  );
}

export default App;
