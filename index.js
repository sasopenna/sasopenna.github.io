let agrid = blankGrid(4, 4);

createHTMLgrid('table_grid', agrid);

for (let x = 0; x < 8; x++) {
  addNumber(agrid);
}
updateHTMLgrid("table_grid", agrid);
