import React, { useEffect, useState } from "react";
import {
  checkWin,
  checkTie,
  cells,
  makeMove,
  searchPlaceble,
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
  const [board, setBoard] = useState(searchPlaceble(cells, player));
  const [canPlay, setCanPlay] = useState(true);
  const [end, setEnd] = useState("");
  const isNonMobile = useMediaQuery("(min-width:540px)");
  const [update, setUpdate] = useState(0);
  const handleCellClick = (e) => {
    const id = e.eventObject.coord;
    if (board[id.y][id.x] == P && canPlay) {
      // make move
      console.log("CLICK");
      setBoard(makeMove(board, id.y, id.x, player));
      setUpdate(update + 1);
      const message = {
        event: "message",
        room,
        name,
        id,
        type: player,
      };
      socket.send(JSON.stringify(message));
      setCanPlay(false);
    }
  };

  useEffect(() => {
    const move = messages.id;
    //console.log("MSG",messages);
    if (messages.type === B) {
      setPlayer(W);
    }
    //console.log("PLAYER",player);
    messages.id
      ? setBoard(
          makeMove(searchPlaceble(board, player), move.y, move.x, messages.type)
        )
      : null;
    setUpdate(update + 2);
    setCanPlay(true);
  }, [messages]);

  // useEffect(() => {
  //   const winner = checkWin(board);
  //   const tie = checkTie(board);
  //   if (winner || tie) {
  //     setCanPlay(false);
  //     setEnd(winner ? winner : tie);
  //     setMessages("");
  //   }
  // }, [board]);

  useEffect(() => {
    if (restart) {
      setBoard(cells);
      setMessages("");
      setCanPlay(true);
    }
  }, [restart]);

  const boardThemeSecord = useLoader(GLTFLoader, "./models/board.glb");
  const boardThemeFirst = useLoader(GLTFLoader, "./models/board_first.glb");
  const tokenWhite = useLoader(GLTFLoader, "./models/token_white.glb");
  const tokenBlack = useLoader(GLTFLoader, "./models/token_black.glb");
  const emptyFirst = useLoader(GLTFLoader, "./models/empty.glb");
  const placeble = useLoader(GLTFLoader, "./models/placeble.glb");
  console.log("BOARD", board);
  //console.log("MSG", messages);
  return (
    <section className="main-section">
      <Typography className="text-center">New game</Typography>
      {!end ? (
        <Box
          sx={{ width: "80vw", height: "80vw", maxHeight: "80vh" }}
          margin={"0 auto"}
          marginTop={isNonMobile ? "0" : "15vmin"}
        >
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
            Game over! <br /> {end.winner ? `Winner: ${end.winner}` : "Tie!"}
          </Typography>
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
