import Cell from "../Cell/Cell";

const BoardRow = ({
  row,
  y,
  handleCellClick,
  board,
  blackModel,
  whiteModel,
  toggleTheme,
  modelEmpty,
  update,
  placeble,
}) => {
  return (
    <>
      {row.map((position, x) => (
        <Cell
          key={x}
          board={board}
          modelEmpty={modelEmpty}
          nullModel={whiteModel}
          plusModel={blackModel}
          position={position}
          coord={{ y, x }}
          handleCellClick={handleCellClick}
          toggleTheme={toggleTheme}
          update={update}
          placeble={placeble}
        />
      ))}
    </>
  );
};
export default BoardRow;
