import React, { useState, useEffect } from 'react';
import { SocketProvider } from "../api/SocketProvider";
import Alert from '@mui/material/Alert';


function ListNotifs({type}) {
 const [notif, setNotif] = useState(null);
 useEffect(() => {
  SocketProvider.listNotifs((data) => {
   setNotif(data);
   if (data) {
    setTimeout(() => {
     setNotif(null);
    }, 5000);
   }
  });
 }, []);

 return (
  <div>
   {notif && (
    <Alert severity={type} style={{ margin: '1rem' }}>
     <b>Nouvelle notification</b> : {notif.message}
    </Alert>
   )}
  </div>
 );
}

export default ListNotifs;
