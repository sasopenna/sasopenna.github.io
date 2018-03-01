class Game2048 {
  constructor(table_id, rows, cols) {
    this.table_id = table_id;
    this.rows = rows;
    this.cols = cols;
    this.grid = Game2048.blankGrid(rows, cols);
    this.keys = [];
    this.started = false;

    this.createHTMLgrid();
    for (let x = 0; x < 3; x++) {
      this.addNumber();
    }
    this.updateHTMLgrid();
  }

  createHTMLgrid() {
    let tab = document.getElementById(this.table_id);

    if(!tab) {
      console.log("ERROR: Table not found");
      return;
    }
    if(this.grid.length == 0) {
      console.log("ERROR: Grid not initialized");
      return;
    }
    for(let i = 0; i < this.rows; i++) {
      let row = tab.insertRow(0);

      for(let j = 0; j < this.cols; j++) {
        let index = j + i * this.cols;
        row.insertCell(j);
      }
    }
  }

  updateHTMLgrid() {
    let tab = document.getElementById(this.table_id);

    if(!tab) {
      console.log("ERROR: Table not found");
      return;
    }
    if(this.grid.length == 0) {
      console.log("ERROR: Grid not initialized");
      return;
    }

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        let index = j + i * this.cols;
        let cell = tab.rows[i].cells[j];
        if(!cell) {
          console.log("ERROR: Table not initialized")
          return;
        }
        cell.innerHTML = (this.grid[i][j] == 0) ? "" : this.grid[i][j];

        let search = this.grid[i][j].toString();
        let size = 0;
        if(this.grid[i][j] > 2048) {
          size -= (search.length - 4) * 2;
          search = "-1";
        }
        size += cellOptions[search].size;
        cell.style.color = cellOptions[search].color;
        cell.style.background = cellOptions[search].bgcolor;
        cell.style.fontSize = size;
      }
    }
  }

  addNumber() {
    if(this.grid.length == 0) {
      console.log("ERROR: Grid not initialized");
      return;
    }
    let add = [];

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        if(this.grid[i][j] !== 0) continue;
        add.push({
          r: i,
          c: j
        });
      }
    }

    if(add.length > 0) {
      let spot = add[Math.floor(Math.random() * add.length)];
      this.grid[spot.r][spot.c] = (Math.random() > 0.25) ? 2 : 4;
    }
  }

  combineNumbers(d) {
    let dir = this.getIndexKey(d);
    if(dir == -1) return;

    if(this.grid.length == 0) {
      console.log("ERROR: Grid not initialized");
      return;
    }
    let array = [];

    if(dir % 2 == 0) {
      for(let i = 0; i < this.rows; i++) {
        if(dir == 0) array = this.grid[i];
        else if(dir == 2) {
          array = [];
          for(let j = this.cols - 1; j >= 0; j--) {
            array.push(this.grid[i][j]);
          }
        }

        array = Game2048.operateArray(array);
        for(let j = 0; j < this.cols; j++) {
          this.grid[i][j] = array[Game2048.getIndex(dir+1, j, this.cols)];
        }
      }
    } else {
      for(let j = 0; j < this.cols; j++) {
        array = [];
        if(dir == 1) {
          for(let i = 0; i < this.rows; i++) {
            array.push(this.grid[i][j]);
          }
        } else if(dir == 3) {
          for(let i = this.rows - 1; i >= 0; i--) {
            array.push(this.grid[i][j]);
          }
        }

        array = Game2048.operateArray(array);
        for(let i = 0; i < this.rows; i++) {
          this.grid[i][j] = array[Game2048.getIndex(dir, i, this.rows)];
        }
      }
    }
    this.moveNumbers(dir);
    this.addNumber();
    this.updateHTMLgrid();
  }

  moveNumbers(dir) {
    if(this.grid.length == 0) {
      console.log("ERROR: Grid not initialized");
      return;
    }
    let array = [];

    if(dir % 2 == 0) {
      for(let i = 0; i < this.rows; i++) {
        array = [];
        for(let index = 0; index < this.cols; index++) {
          let j = (dir == 2) ? this.cols - index - 1 : index;
          array.push(this.grid[i][j]);
        }

        array = Game2048.moveArray(array);
        for(let j = 0; j < this.cols; j++) {
          this.grid[i][j] = array[Game2048.getIndex(dir+1, j, this.cols)];
        }
      }
    } else {
      for(let j = 0; j < this.cols; j++) {
        array = [];
        for(let index = 0; index < this.rows; index++) {
          let i = (dir == 3) ? this.rows - index - 1 : index;
          array.push(this.grid[i][j]);
        }

        array = Game2048.moveArray(array);
        for(let i = 0; i < this.rows; i++) {
          this.grid[i][j] = array[Game2048.getIndex(dir, i, this.rows)];
        }
      }
    }
  }

  getIndexKey(d) {
    for(let k = 0; k < this.keys.length; k++) {
      if(this.keys[k] != d) continue;
      return k;
    }
    return -1;
  }

  setKeys(up, down, left, right) {
    this.keys[0] = keyCodes[left];
    this.keys[1] = keyCodes[up];
    this.keys[2] = keyCodes[right];
    this.keys[3] = keyCodes[down];
  }

  static startKeyListener(game) {
    if(game.started) return;
    game.started = true;

    document.addEventListener('keydown', function(event) {
      const k = event.keyCode;
      game.combineNumbers(k);
    });
  }

  static blankGrid(rows, cols) {
    let newgrid = [];
    for(let i = 0; i < rows; i++) {
      newgrid[i] = [];
      for(let j = 0; j < cols; j++) {
        newgrid[i][j] = 0;
      }
    }
    return newgrid;
  }

  static operateArray(arr) {
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

  static moveArray(arr) {
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

  static getIndex(id, i, max = -1) {
    return (id == 1) ? i : max - 1 - i;
  }
}
