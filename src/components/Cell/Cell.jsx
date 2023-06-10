import { useEffect, useState } from "react";
import { B, W, E, P } from "../helpers/constants.js";
const Cell = ({
  position,
  handleCellClick,
  coord,
  board,
  plusModel,
  nullModel,
  toggleTheme,
  modelEmpty,
  update,
  placeble,
}) => {
  const [model, setModel] = useState(modelEmpty);
  //console.log("VALUE", board[coord.y][coord.x]);
  useEffect(() => {
    //console.log("HERE");
    switch (board[coord.y][coord.x]) {
      case W:
        setModel(nullModel);
        break;
      case B:
        setModel(plusModel);
        break;
      case E:
        setModel(modelEmpty);
        break;
      case P:
        setModel(placeble);
        break;
    }
  }, [update, toggleTheme]);
  //console.log(board);
  //console.log("Cell",board);
  return (
    <primitive
      object={model.scene.clone(true)}
      position={position}
      children-0-castShadow
      onClick={handleCellClick}
      coord={coord}
    />
  );
};
export default Cell;
