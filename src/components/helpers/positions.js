const createPosition = () => {
  let positions = [],
    y = 0;

  while (y <= 140) {
    let x = 0,
      row = [];
    while (x <= 140) {
      row.push([x, 0, y]);
      x = Math.floor((x + 19.42) * 100) / 100;
    }
    positions.push(row);
    y = Math.floor((y + 19.4) * 100) / 100;
  }

  return positions;
};

const positions = createPosition();

export default positions;
