var column;
//var numberOfColumn = function() {
function numberOfColumn() {
  column = parseInt(document.getElementById("number").value);

  var createTable = document.createElement("TABLE");
  createTable.setAttribute("id", "my-table");

  document.querySelector(".table-area").appendChild(createTable);

  var row = createTable.insertRow(0);
  for (var i = 0; i < column; i++) {
    row.insertCell(i).innerHTML = '<div class="text-area">&nbsp;</div>';

    document
      .querySelectorAll(".text-area")
      [i].setAttribute("contentEditable", "true");
  }
  document
    .querySelector(".add-preview")
    .insertAdjacentHTML("beforeend", '<button class="add-row">+ Row</button>');
  document
    .querySelector(".add-preview")
    .insertAdjacentHTML(
      "beforeend",
      '<button class="preview">Generate Html</button>'
    );
}

// Add row to existing table

function addRow() {
  var getNumberOfRow = document.querySelector("table").rows.length;
  var getNumberOfColumn = document.querySelector("tr").cells.length;

  var getTable = document.querySelector("table");
  var row = getTable.insertRow(getNumberOfRow);
  for (var i = 0; i < column; i++) {
    //for (var i = 0; i < col; i++) {
    row.insertCell(i).innerHTML = '<div class="text-area">&nbsp;</div>';
    row
      .querySelectorAll(".text-area")
      [i].setAttribute("contentEditable", "true");
  }
}

// Get html table and its children using jQuery
var getHtmlTags = function() {
  var content = $(".table-area").html();

  var newContent = content.replace(/<\W*tbody>/g, "");
  var newContent = newContent.replace(/(&nbsp;)/g, "");
  var newContent = newContent.replace(
    /(<div\s*class="text-area"\s*contenteditable="true">)|(<\Wdiv>)/g,
    ""
  );
  return newContent;
};

// Beautify Html Strings to display on textarea tag.
// Taken from http://jsfiddle.net/1gf07wap/
var process = function(str) {
  var div = document.createElement("div");
  div.innerHTML = str.trim();

  return format(div, 0).innerHTML;
};

var format = function(node, level) {
  var indentBefore = new Array(level++ + 1).join("  "),
    indentAfter = new Array(level - 1).join("  "),
    textNode;

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode("\n" + indentBefore);
    node.insertBefore(textNode, node.children[i]);

    format(node.children[i], level);

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode("\n" + indentAfter);
      node.appendChild(textNode);
    }
  }

  return node;
};

var textareaDisplay = function() {
  var content = getHtmlTags();
  var text = process(content);
  $(".html-viewer").text(text);
};

function toggleSelectedCell(row, col) {
  table = document.getElementById("my-table");
  if (
    table.rows[row].cells[col].getAttribute("class") !==
    "to-merge-row_" + row
  ) {
    table.rows[row].cells[col].setAttribute("class", "to-merge-row_" + row);
    table.rows[row].cells[col].setAttribute("style", "background-color:green");
  } else {
    table.rows[row].cells[col].removeAttribute("class");
    table.rows[row].cells[col].removeAttribute("style");
  }
}

// Merge cells
var table, row, col;
function mergeCells() {
  var tdClass = document.querySelector(".to-merge-row_" + row); // Get the first element
  var mergeCellLength = document.querySelectorAll(".to-merge-row_" + row)
    .length;
  var cellToMerge = tdClass.parentNode;
  var rIndex = tdClass.parentNode.rowIndex;
  var cIndex = tdClass.cellIndex; // Index of the first element

  // Get colspan attribute value
  var colspanValue = document.querySelectorAll(".to-merge-row_" + row);

  var value = 0;
  for (var i = 0; i < colspanValue.length; i++) {
    if (isNaN(parseInt(colspanValue[i].getAttribute("colspan")))) {
      value += 1;
    } else {
      value += parseInt(colspanValue[i].getAttribute("colspan"));
    }
  }

  if (isGapExistInSelectedCells()) {
    for (var i = cIndex + mergeCellLength - 1; i > cIndex; i--) {
      tdClass.setAttribute("colspan", value);
      cellToMerge.deleteCell(i);

      tdClass.removeAttribute("style");
      tdClass.removeAttribute("class");
    }
  } else {
    // Remove style and class from the cells
    for (var i = 0; i < table.rows.length; i++) {
      for (var j = 0; j < table.rows[i].cells.length; j++) {
        document
          .getElementById("my-table")
          .rows[i].cells[j].removeAttribute("class");
        document
          .getElementById("my-table")
          .rows[i].cells[j].removeAttribute("style");
      }
    }
  }
}

//------------------- Merge cell vertical--------------------------------

function mergeDown() {
  var count = 0,
    spanAttr = 0,
    colLength = 0,
    colSpan = { row: [], col: [] };
  var startAtCol, startAtRow;
  for (var i = 0; i < document.getElementById("my-table").rows.length; i++) {
    for (
      var j = 0;
      j < document.getElementById("my-table").rows[i].cells.length;
      j++
    ) {
      if (
        document
          .getElementById("my-table")
          .rows[i].cells[j].hasAttribute("style")
      ) {
        count = 1;
        colSpan.row.push(i);
        colSpan.col.push(j);
        if (
          document
            .getElementById("my-table")
            .rows[i].cells[j].hasAttribute("rowspan")
        ) {
          count = parseInt(
            document
              .getElementById("my-table")
              .rows[i].cells[j].getAttribute("rowspan")
          );
        }
      } else {
        continue;
      }
      colLength += count;
    }
  }
  //return { rowSpanValue: colLength + spanAttr, startAtRow : colSpan.row[0], startAtCol : colSpan.col[0] }
  rowSpanValue = colLength + spanAttr;
  startAtRow = colSpan.row[0];
  startAtCol = colSpan.col[0];

  if (isRowInOrder(colSpan.row) || isSameColumn(colSpan.col)) {
    document
      .getElementById("my-table")
      .rows[startAtRow].cells[startAtCol].setAttribute("rowspan", rowSpanValue);

    document
      .getElementById("my-table")
      .rows[startAtRow].cells[startAtCol].removeAttribute("class");
    document
      .getElementById("my-table")
      .rows[startAtRow].cells[startAtCol].removeAttribute("style");

    // check selected cells before delete
    for (var i = 0; i < document.getElementById("my-table").rows.length; i++) {
      for (
        var j = 0;
        j < document.getElementById("my-table").rows[i].cells.length;
        j++
      ) {
        if (
          document
            .getElementById("my-table")
            .rows[i].cells[j].hasAttribute("style")
        ) {
          document.getElementById("my-table").rows[i].deleteCell(j);
        }
      }
    }
  } else {
    return;
  }

  // Check if selected cells are in the same column
  function isSameColumn(array) {
    for (var i = 0; i < array.length - 1; ++i) {
      if (array[i + 1] - array[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  // Check if selected cell are in the row ordered
  function isRowInOrder(arr) {
    var array = arr.sort();
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i + 1] - 1 !== array[i]) {
        return false;
      }
    }
    return true;
  }
}

//-------------------End of merge cells vertical--------------------------------------

// Function to check if selected cell is sequentially the same row.
// If there is no gap return true
function isGapExistInSelectedCells() {
  var count = 0;
  var firstCellIndex = document.querySelector(".to-merge-row_" + row).cellIndex; // first cell indext
  var mergeCellLength = document.querySelectorAll(".to-merge-row_" + row)
    .length; // number of cell to merge
  for (var i = firstCellIndex; i < mergeCellLength + firstCellIndex; i++) {
    // Count the number of gaps between the first and last cell in the same row
    if (
      document
        .getElementById("my-table")
        .rows[row].cells[i].getAttribute("class") !==
      "to-merge-row_" + row
    ) {
      count += 1;
    }
  }
  return count <= 0;
}

function isMoreThanOneRowSelected() {
  var count = 0;
}

var setupEventListener = function() {
  document.querySelector(".submit").addEventListener("click", numberOfColumn);
  document
    .querySelector(".add-preview")
    .addEventListener("click", function(event) {
      if (event.target.className === "add-row") {
        addRow();
      }
      if (event.target.className === "preview") {
        textareaDisplay();
      }
    });

  document
    .querySelector(".table-area")
    .addEventListener("mousedown", function(event) {
      //document.getElementById('my-table').addEventListener('click',function(event) {
      if (event.target.nodeName === "TD") {
        row = event.target.parentNode.rowIndex;
        col = event.target.cellIndex;

        // Detect clicked cell (row and cell indices)
        toggleSelectedCell(row, col);
      } else {
        return;
      }
    });
  document.getElementById("merge").addEventListener("click", mergeCells);
  document.getElementById("merge-column").addEventListener("click", mergeDown);
};

//numberOfColumn();
setupEventListener();
