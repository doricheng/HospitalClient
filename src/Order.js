import React, { Fragment, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from "@mui/material";

import { IP, PORT } from "./config";
import axios from "axios";

const Order = ({ open, onClose, selectedPatient, orders, getPateintOrder }) => {
  const emptyOrder = {
    patient: "",
    message: "",
  };

  const [orderDialog, setOrderDialog] = useState(false);
  const [order, setOrder] = useState(emptyOrder);

  const onOpenOrderDialog = (data) => {
    //edit
    if (data._id) {
      let _order = { ...data };

      setOrder(_order);
    } else {
      //add
      setOrder(emptyOrder);
    }
    setOrderDialog(true);
  };

  const handleOrderDialog = () => {
    setOrderDialog(false);
  };

  const handleOrderChange = (event) => {
    let _order = { ...order, message: event.target.value };
    setOrder(_order);
  };

  const onSubmit = () => {
    //add
    if (!order._id) {
      let params = {
        ...order,
        patient: selectedPatient._id,
      };

      axios.post(`http://${IP}:${PORT}/order`, params).then(async (res) => {
        if (res.status === 201) {
          handleOrderDialog();
          getPateintOrder(selectedPatient._id);
        }
      });
    }
    //edit
    else {
      axios
        .patch(`http://${IP}:${PORT}/order/${order._id}`, {
          message: order.message,
        })
        .then(async (res) => {
          if (res.status === 200) {
            handleOrderDialog();
            getPateintOrder(selectedPatient._id);
          }
        });
    }
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} maxWidth={"lg"}>
        <DialogTitle id="scroll-dialog-title">
          {selectedPatient && (
            <span>
              {selectedPatient.name}({selectedPatient.pid})
            </span>
          )}
          醫囑
        </DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ mb: "1rem" }}
              onClick={onOpenOrderDialog}
            >
              <Typography>新增醫囑</Typography>
            </Button>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>內容</TableCell>
                  <TableCell align="right">編輯</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.message}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onOpenOrderDialog(item)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <Dialog open={orderDialog} onClose={handleOrderDialog} maxWidth={"lg"}>
        <DialogTitle id="scroll-dialog-title">
          {`${order._id ? "編輯" : "新增"}`}醫囑
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-multiline-static"
            label="內容"
            multiline
            rows={4}
            value={order.message}
            onChange={handleOrderChange}
            sx={{
              margin: "1rem",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onSubmit} disabled={!order.message}>
            儲存
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Order;
