import "./App.css";
import * as React from "react";
import Container from "@mui/material/Container";
import PatientList from "./PatientList";

function App() {
  return (
    <Container sx={{ backgroudColor: "#ccc" }}>
      <PatientList />
    </Container>
  );
}

export default App;
