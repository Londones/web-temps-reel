import React, { useState, useEffect } from 'react';
import { SocketProvider } from "../api/SocketProvider";
import Alert from '@mui/material/Alert';

function ListNotifs({ type }) {
  const [notif, setNotif] = useState(null);
  const [notifTimer, setNotifTimer] = useState(null);

  useEffect(() => {
    SocketProvider.listNotifs((data) => {
      setNotif(data);
      if (data) {
        setTimeout(() => {
          setNotif(null);
        }, 5000);
      }
    });

    SocketProvider.listNotifTimer((data) => {
     setNotifTimer(data);
     if (data) {
       setTimeout(() => {
        setNotifTimer(null);
       }, 11000);
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
      {notifTimer && (
        <Alert severity={type} style={{ margin: '1rem' }}>
          <b>Notification Timer</b> : {notifTimer.message}
        </Alert>
      )}
    </div>
  );
}

export default ListNotifs;