import React from "react";
import Board from "../Board/Board";
import { Box, Button, Typography } from "@mui/material";
const GameRoom = ({
  socket,
  name,
  setConnected,
  canStart,
  setCanStart,
  setRestart,
  ...props
}) => {
  const handleExit = () => {
    socket.close(1000, `${name}`);
    setConnected(false);
    setRestart(true);
    setCanStart(false);
  };
  return (
    <main>
      <Box
        sx={{
          maxWidth: "250px",
          height: "80px",
          zIndex: 1,
          color: "white",
          position: "relative",
          m: "0 auto",
          pt: "50px",
          display: "flex",
        }}
      >
        <Typography
          sx={{
            m: "0 auto",
            pt: "5px",
            px: "10px",
            width: "100%",
            borderRadius: "5px",
            bgcolor: "rgba(4,4,4,0.3)",
            color: "white",
          }}
        >
          Player: {name}
        </Typography>
        <Button
          onClick={handleExit}
          sx={{ bgcolor: "grey", color: "white", ml: "-3px" }}
        >
          Exit
        </Button>
      </Box>
      {canStart ? (
        <Board
          socket={socket}
          name={name}
          setCanStart={setCanStart}
          {...props}
          setRestart={setRestart}
        />
      ) : (
        <Typography
          sx={{
            zIndex: 1,
            color: "white",
            position: "relative",
            py: 4,
            textAlign: "center",
            mt: "20%",
          }}
        >
          Please wait for your opponent...
        </Typography>
      )}
    </main>
  );
};

export default GameRoom;
