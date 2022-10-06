import React, { Fragment, useCallback, useEffect, useState } from "react";
import { IP, PORT } from "./config";
import axios from "axios";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import Order from "./Order";

const PatientList = () => {
  const [dialog, setDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //病人清單
  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://${IP}:${PORT}/patient`).then((res) => {
      if (res.status === 200) {
        setPatients(res.data);
        setIsLoading(false);
      }
    });
  }, []);

  //病人醫囑
  const getPateintOrder = useCallback((patientId) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`http://${IP}:${PORT}/order/${patientId}`)
        .then((res) => {
          if (res.status === 200) {
            setOrders(res.data);
          }
          resolve();
        })
        .catch((err) => reject(err));
    });
  }, []);

  const onOpen = async (info) => {
    setSelectedPatient(info);
    await getPateintOrder(info._id);
    setDialog(true);
  };

  const handleClose = () => {
    setDialog(false);
  };

  return (
    <Fragment>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: "1rem" }} variant="h5" gutterBottom>
          病人清單
        </Typography>
        <List>
          {patients.map((patient) => (
            <Fragment key={patient._id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onOpen(patient)}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={`${patient.name}(${patient.pid})`} />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Grid>
      <Order
        open={dialog}
        onClose={handleClose}
        selectedPatient={selectedPatient}
        orders={orders}
        getPateintOrder={getPateintOrder}
      />
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
};

export default PatientList;
