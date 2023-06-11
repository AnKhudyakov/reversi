import React, { useEffect, useState } from "react";
import {
  checkStatus,
  getCells,
  makeMove,
  searchPlaceble,
  getUserColor,
} from "../helpers/gameLogic";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useLoader } from "@react-three/fiber";
import positions from "../helpers/positions";
import BoardRow from "../BoardRow/BoardRow";
import { B, W, E, P } from "../helpers/constants.js";

const Board = ({
  messages,
  name,
  room,
  socket,
  setMessages,
  restart,
  setRestart,
  toggleTheme,
}) => {
  const [player, setPlayer] = useState(B);
  const [board, setBoard] = useState(searchPlaceble(getCells(), player));
  const [canPlay, setCanPlay] = useState(true);
  const [end, setEnd] = useState("");
  const isNonMobile = useMediaQuery("(min-width:540px)");
  const [update, setUpdate] = useState(0);
  const [skipMessage, setSkipMessage] = useState("");
  const [count, setCount] = useState({});
  const handleCellClick = (e) => {
    const id = e.eventObject.coord;
    if (board[id.y][id.x] == P && canPlay) {
      const newBoard = makeMove(board, id.y, id.x, player);
      setBoard(newBoard);
      const message = {
        event: "message",
        room,
        name,
        id,
        type: player,
      };
      socket.send(JSON.stringify(message));
      setCanPlay(false);
      setUpdate(update + 1);
    }
  };

  useEffect(() => {
    const move = messages.id;
    if (messages.type === B) {
      setPlayer(W);
    }
    messages.id
      ? setBoard(
          makeMove(searchPlaceble(board, player), move.y, move.x, messages.type)
        )
      : null;
    setUpdate(update + 2);
    setCanPlay(true);
    setSkipMessage("");
  }, [messages]);

  useEffect(() => {
    const result = checkStatus(board, messages.id);
    if (result.gameover) {
      setCanPlay(false);
      setEnd(result.message);
      setMessages("");
    } else if (result.skip) {
      setSkipMessage("Skipped. " + getUserColor(player) + " again.");
      const message = {
        event: "message",
        room,
        name,
        id: false,
        type: player,
      };
      socket.send(JSON.stringify(message));
      setCanPlay(false);
    }
    setCount({ black: result.cntBlack, white: result.cntWhite });
  }, [update, messages]);

  useEffect(() => {
    if (restart) {
      setBoard(searchPlaceble(getCells(), player));
      setMessages("");
      setCanPlay(true);
      setUpdate(update + 1);
    }
  }, [restart]);

  const boardThemeSecord = useLoader(GLTFLoader, "./models/boardReversi.glb");
  const boardThemeFirst = useLoader(GLTFLoader, "./models/board.glb");
  const tokenWhite = useLoader(GLTFLoader, "./models/token_white.glb");
  const tokenBlack = useLoader(GLTFLoader, "./models/token_black.glb");
  const emptyFirst = useLoader(GLTFLoader, "./models/empty.glb");
  const placeble = useLoader(GLTFLoader, "./models/placeble.glb");

  return (
    <section className="main-section">
      {!end ? (
        <Box
          sx={{ width: "80vmin", position: "relative" }}
          maxHeight={"70vmin"}
          height={"70vmin"}
          margin={"0 auto"}
          marginTop={isNonMobile ? "0" : "15vmin"}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              maxWidth: "70%",
              m: "0 auto",
              zIndex: 1,
              color: "white",
              position: "relative",
              textAlign: "center",
              borderRadius: "5px",
              bgcolor: "rgba(4,4,4,0.3)",
              p: 1,
            }}
          >
            <Typography>
              Your Color:
              <br />
              {getUserColor(player)}
            </Typography>
            <Typography>
              Count Black:
              <br />
              {count.black}
            </Typography>
            <Typography>
              Count White:
              <br />
              {count.white}
            </Typography>
          </Box>
          <Canvas
            camera={{
              position: [0, 140, 70],
              rotation: [-Math.PI / 2.5, 0, 0],
            }}
            shadows
          >
            <ambientLight intensity={1} />
            <directionalLight
              intensity={0.4}
              position={[0, 5, -5]}
              castShadow
            />
            <primitive
              object={
                toggleTheme ? boardThemeSecord.scene : boardThemeFirst.scene
              }
              position={[0, 0, 0]}
              children-0-castShadow
            />

            {positions.map((row, y) => (
              <BoardRow
                key={row}
                row={row}
                y={y}
                board={board}
                modelEmpty={emptyFirst}
                whiteModel={tokenWhite}
                blackModel={tokenBlack}
                handleCellClick={handleCellClick}
                toggleTheme={toggleTheme}
                placeble={placeble}
                update={update}
              />
            ))}
          </Canvas>
          <Typography
            sx={{
              width: "100%",
              zIndex: 1,
              position: "absolute",
              textAlign: "center",
            }}
            bottom={isNonMobile ? "-50px" : "-50"}
          >
            {skipMessage}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            zIndex: 1,
            color: "white",
            position: "relative",
            textAlign: "center",
            mt: "20%",
          }}
        >
          <Typography sx={{ zIndex: 1, color: "white" }}>
            Game over! <br /> {end}
          </Typography>
          <Box sx={{
              display: "flex",
              justifyContent: "space-around",
              maxWidth: "300px",
              m: "0 auto",
              zIndex: 1,
              color: "white",
              position: "relative",
              textAlign: "center",
              borderRadius: "5px",
              bgcolor: "rgba(4,4,4,0.3)",
              p: 1,
            }}><Typography>
              Count Black:
              <br />
              {count.black}
            </Typography>
            <Typography>
              Count White:
              <br />
              {count.white}
            </Typography></Box>
          <Button
            sx={{ bgcolor: "grey", color: "white", mt: "20px" }}
            onClick={() => {
              setRestart(restart + 1);
              setEnd("");
            }}
          >
            New Game
          </Button>
        </Box>
      )}
    </section>
  );
};

export default Board;
