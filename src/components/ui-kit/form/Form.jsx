import React from "react";
import { grey } from "@mui/material/colors";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  Box,
  keyframes,
} from "@mui/material";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";
import FaceTwoToneIcon from "@mui/icons-material/FaceTwoTone";
import PlayCircleTwoToneIcon from "@mui/icons-material/PlayCircleTwoTone";
const Form = ({
  setSocket,
  name,
  room,
  setRoom,
  setName,
  setInfo,
  setConnected,
  setMessages,
  setCanStart,
  setRestart,
}) => {
  const handleConnect = () => {
    setInfo("");
    if (name.length) {
      const socket = new WebSocket(import.meta.env.VITE_API_WS);
      setSocket(socket);
      socket.onopen = () => {
        setConnected(true);
        const message = {
          event: "connection",
          name,
          room,
          id: Date.now(),
        };
        socket.send(JSON.stringify(message));
      };
      socket.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        switch (msg.event) {
          case "message":
            setMessages(msg);
            break;
          case "info":
            setInfo(msg.content);
            setConnected(false);
            break;
          case "canStart":
            setCanStart(true);
            break;
          case "opponentLeave":
            setCanStart(false);
            setRestart(true);
            break;
        }
      };
      socket.onclose = () => {
        setConnected(false);
      };
      socket.onerror = () => {
        console.log("Connection died");
      };
    } else {
      console.log("Please enter name");
    }
  };
  const pulsate = keyframes`
  0% {
    -webkit-box-shadow: inset 0 0 25px 3px hsla(0,0%,100%,.75),0 0 25px 10px hsla(0,0%,100%,.75);
    box-shadow: inset 0 0 25px 3px hsla(0,0%,100%,.75),0 0 25px 10px hsla(0,0%,100%,.75);
    opacity: 1;
    -webkit-transform: scale(.6);
    transform: scale(.6)
}

to {
    -webkit-box-shadow: none;
    box-shadow: none;
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1)
}
  `;

  return (
    <Box
      sx={{
        width: "100%",
        p: 5,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormControl sx={{ mb: 5, width: "25ch" }} variant="outlined">
        <InputLabel
          htmlFor="outlined-adornment-login"
          sx={{ color: `${grey[50]}` }}
        >
          Your Name
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-login"
          sx={{
            color: `${grey[50]}`,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderRadius: 0,
              borderBottom: "1px solid grey",
              borderColor: "#1976d2",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderRadius: 0,
              borderBottom: "1px solid grey",
              borderColor: "white",
            },
          }}
          endAdornment={
            <InputAdornment position="start">
              <FaceTwoToneIcon
                sx={{
                  color: `${grey[50]}`,
                  borderRadius: "50%",
                }}
              />
            </InputAdornment>
          }
          value={name}
          name={name}
          onChange={(e) => setName(e.target.value)}
          label="Your username"
          required
        />
      </FormControl>

      <FormControl sx={{ mb: 5, width: "25ch" }} variant="outlined">
        <InputLabel
          htmlFor="outlined-adornment-room"
          sx={{ color: `${grey[50]}` }}
        >
          Choose Room
        </InputLabel>
        <OutlinedInput
          color="primary"
          sx={{
            color: `${grey[50]}`,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderRadius: 0,
              borderBottom: "1px solid grey",
              borderColor: "#1976d2",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderRadius: 0,
              borderBottom: "1px solid grey",
              borderColor: "white",
            },
          }}
          id="outlined-adornment-room"
          endAdornment={
            <InputAdornment position="start">
              <MeetingRoomTwoToneIcon
                sx={{
                  color: `${grey[50]}`,
                  borderRadius: "50%",
                }}
              />
            </InputAdornment>
          }
          name={room}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          label="Your username"
          type="number"
          required
        />
      </FormControl>
      <IconButton
        sx={{
          width: "100px",
          textAlign: "center",
          animationIterationCount: "infinite",
        }}
        aria-label="toggle password visibility"
        onClick={handleConnect}
        edge="end"
      >
        <Box
          sx={{
            color: grey[50],
            position: "absolute",
            width: "100px",
            height: "100px",
            border: "5px solid hsla(0,0%,100%,.75)",
            borderRadius: "50%",
            boxShadow: "0 0 25px 3px rgba(100,181,246,.8)",
            animationDelay: "0s",
            animation: `${pulsate} 2s`,
            animationIterationCount: "infinite",
          }}
        ></Box>
        <PlayCircleTwoToneIcon
          sx={{
            color: grey[50],
            width: "70px",
            height: "70px",
          }}
        />
      </IconButton>
    </Box>
  );
};

export default Form;
