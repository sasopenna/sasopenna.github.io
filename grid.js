let blankGrid = (rows, cols) => {
  let newgrid = [];
  for(let i = 0; i < rows; i++) {
    newgrid[i] = [];
    for(let j = 0; j < cols; j++) {
      newgrid[i][j] = 0;
    }
  }
  return newgrid;
}

let createHTMLgrid = (table_id, _grid) => {
  let tab = document.getElementById(table_id);

  if(!tab) {
    console.log("ERROR: Table not found");
    return;
  }
  if(_grid.length == 0) {
    console.log("ERROR: Grid not initialized");
    return;
  }
  let rows = _grid.length;
  let cols = _grid[0].length;

  for(let i = 0; i < rows; i++) {
    let row = tab.insertRow(0);

    for(let j = 0; j < cols; j++) {
      let index = j + i * cols;
      //let cell = row.insertCell(j);
      //cell.id = index;
      row.insertCell(j);
    }
  }
}

let updateHTMLgrid = (table_id, _grid) => {
  let tab = document.getElementById(table_id);

  if(!tab) {
    console.log("ERROR: Table not found");
    return;
  }
  if(_grid.length == 0) {
    console.log("ERROR: Grid not initialized");
    return;
  }
  let rows = tab.rows.length;
  let cols = tab.rows[0].cells.length;

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let index = j + i * cols;
      let cell = tab.rows[i].cells[j];
      if(!cell) {
        console.log("ERROR: Table not initialized")
        return;
      }
      cell.innerHTML = (_grid[i][j] == 0) ? "" : _grid[i][j];

      let search = "" + _grid[i][j];
      cell.style.background = cellOptions[search].color;
      cell.style.fontSize = cellOptions[search].size;
    }
  }
}

let addNumber = (_grid) => {
  if(_grid.length == 0) {
    console.log("ERROR: Grid not initialized");
    return;
  }
  let rows = _grid.length;
  let cols = _grid[0].length;

  let add = [];

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(_grid[i][j] !== 0) continue;
      add.push({
        r: i,
        c: j
      });
    }
  }

  if(add.length > 0) {
    let spot = add[Math.floor(Math.random() * add.length)];
    _grid[spot.r][spot.c] = (Math.random() > 0.25) ? 2 : 4;
  }
}

let operateArray = (arr) => {
  let array = arr;
  for(let i = 0; i < array.length; i++) {
    if(array[i] == 0) continue;
    for(let j = i+1; j < array.length; j++) {
      if(array[j] == 0) continue;
      if(array[i] != array[j]) break;
      array[j] = 0;
      array[i] *= 2;
      break;
    }
  }
  return array;
}

let moveArray = (arr) => {
  let array = arr;
  for(let i = 0; i < array.length-1; i++) {
    if(array[i] !== 0) continue;
    for(let j = i+1; j < array.length; j++) {
      if(array[j] == 0) continue;
      array[i] = array[j];
      array[j] = 0;
      break;
    }
  }
  return array;
}

let getIndex = (id, i, max = -1) => (id == 1) ? i : max - 1 - i;

let combineNumbers = (dir, _grid) => {
  if(_grid.length == 0) {
    console.log("ERROR: Grid not initialized");
    return;
  }
  let rows = _grid.length;
  let cols = _grid[0].length;
  let array = [];

  if(dir % 2 == 0) {
    for(let i = 0; i < rows; i++) {
      if(dir == 0) array = _grid[i];
      else if(dir == 2) {
        array = [];
        for(let j = cols - 1; j >= 0; j--) {
          array.push(_grid[i][j]);
        }
      }

      array = operateArray(array);
      for(let j = 0; j < cols; j++) {
        _grid[i][j] = array[getIndex(dir+1, j, cols)];
      }
    }
  } else {
    for(let j = 0; j < cols; j++) {
      array = [];
      if(dir == 1) {
        for(let i = 0; i < rows; i++) {
          array.push(_grid[i][j]);
        }
      } else if(dir == 3) {
        for(let i = rows - 1; i >= 0; i--) {
          array.push(_grid[i][j]);
        }
      }

      array = operateArray(array);
      for(let i = 0; i < rows; i++) {
        _grid[i][j] = array[getIndex(dir, i, rows)];
      }
    }
  }
  moveNumbers(dir, _grid);
  updateHTMLgrid("table_grid", _grid);
}

let moveNumbers = (dir, _grid) => {
  if(_grid.length == 0) {
    console.log("ERROR: Grid not initialized");
    return;
  }
  let rows = _grid.length;
  let cols = _grid[0].length;
  let array = [];

  if(dir % 2 == 0) {
    for(let i = 0; i < rows; i++) {
      if(dir == 0) array = _grid[i];
      else if(dir == 2) {
        array = [];
        for(let j = cols - 1; j >= 0; j--) {
          array.push(_grid[i][j]);
        }
     }

      array = moveArray(array);
      for(let j = 0; j < cols; j++) {
        _grid[i][j] = array[getIndex(dir+1, j, cols)];
      }
    }
  } else {
    for(let j = 0; j < cols; j++) {
      array = [];
      if(dir == 1) {
        for(let i = 0; i < rows; i++) {
          array.push(_grid[i][j]);
        }

      } else if(dir == 3) {
        for(let i = rows - 1; i >= 0; i--) {
          array.push(_grid[i][j]);
        }
      }

      array = moveArray(array);
      for(let i = 0; i < rows; i++) {
        _grid[i][j] = array[getIndex(dir, i, rows)];
      }
    }
  }

  addNumber(_grid);
}

document.addEventListener('keydown', (event) => {
  const k = event.keyCode - 37;
  if (k < 0 || k > 3) return;
  combineNumbers(k, agrid);
});
