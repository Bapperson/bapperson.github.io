jQuery.fn.puzzle = function (intUserSize) {
  return this.filter(":has(img)").each(
    function (intI) {
      var _solved = false;

      function InitPuzzle() {
        var jPiece = null;
        var intRowIndex, intColIndex, intI = 0;

        intColumns = Math.floor(jImg.width() / intSize);
        intRows = Math.floor(jImg.height() / intSize);
        intPuzzleWidth = (intColumns * intSize);
        intPuzzleHeight = (intRows * intSize);

        jContainer.empty();
        jContainer.css(
          { border: '1px solid black',
            overflow: 'hidden',
            display: 'block'
          })
          .width(intPuzzleWidth)
          .height(intPuzzleHeight);

        if (jContainer.css('position') != 'relative' && jContainer.css('position') != 'absolute') {
          jContainer.css('position', 'relative');
        }

        for (var intRowIndex = 0; intRowIndex < intRows; intRowIndex++) {
          arr2DBoard[intRowIndex] = [];

          for (var intColIndex = 0; intColIndex < intColumns; intColIndex++) {
            jPiece = $("<div><br /></div>");
            jPiece.css(
              { display: 'block',
                float: 'left',
                cursor: 'pointer',
                backgroundImage: "url('" + jImg.attr("src") + "')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: ((intColIndex * -intSize) + "px " + (intRowIndex * -intSize) + "px"),
                position: "absolute",
                top: ((intSize * intRowIndex) + "px"),
                left: ((intSize * intColIndex) + "px")
              })
              .css("-moz-box-shadow", "inset 0 0 20px #555555")
              .css("-webkit-box-shadow", "inset 0 0 20px #555555")
              .css("-ms-box-shadow", "inset 0 0 20px #555555")
              .css("-o-box-shadow", "inset 0 0 20px #555555")
              .css("box-shadow", "inset 0 0 20px #555555")
              .width(intSize)
              .height(intSize);

            jPiece.attr("href", "javascript:void(0);").click(PieceClickHandler);

            arr2DBoard[intRowIndex][intColIndex] = jPiece;

            jContainer.append(jPiece);
          }
        }

        for (var truex = 0; truex < intRows; truex++) {
          for (var truey = 0; truey < intColumns; truey++) {
            arr2DBoard[truex][truey].x = truex;
            arr2DBoard[truex][truey].y = truey;
          }
        }

        arr2DBoard[intRows - 1][intColumns - 1].css("opacity", 0).attr("rel", "empty");

        for (intI = 0; intI < 100; intI++) {
          jPiece = arr2DBoard[(Math.floor(Math.random() * intRows * intRows) % intRows)][(Math.floor(Math.random() * intColumns * intColumns) % intColumns)];
          jPiece.click();
        }

        blnShowAnimation = true;
        return true;
      }

      function PieceClickHandler(objEvent) {
        var jPiece = $(this);
        var jEmpty = jContainer.find("div[rel='empty']");
        var objPiecePos = {
          top: parseInt(jPiece.css("top")),
          left: parseInt(jPiece.css("left"))
        }
        var objEmptyPos = {
          top: parseInt(jEmpty.css("top")),
          left: parseInt(jEmpty.css("left"))
        }
        var intRowIndex, intColIndex = 0;

        if (blnInAnimation) {
          return false;
        }

        jPiece.blur();

        objPiecePos.row = (objPiecePos.top / intSize);
        objPiecePos.col = (objPiecePos.left / intSize);
        objEmptyPos.row = (objEmptyPos.top / intSize);
        objEmptyPos.col = (objEmptyPos.left / intSize);

        if (objPiecePos.row == objEmptyPos.row) {
          if (objPiecePos.col > objEmptyPos.col) {
            for (intColIndex = objEmptyPos.col; intColIndex < objPiecePos.col; intColIndex++) {
              arr2DBoard[objPiecePos.row][intColIndex] = arr2DBoard[objPiecePos.row][intColIndex + 1];
            }
            arr2DBoard[objPiecePos.row][intColIndex] = jEmpty;
          }
          else {
            for (intColIndex = objEmptyPos.col; intColIndex > objPiecePos.col; intColIndex--) {
              arr2DBoard[objPiecePos.row][intColIndex] = arr2DBoard[objPiecePos.row][intColIndex - 1];
            }
            arr2DBoard[objPiecePos.row][intColIndex] = jEmpty;
          }

          for (intColIndex = 0; intColIndex < intColumns; intColIndex++) {
            if (blnShowAnimation) {
              blnInAnimation = true;

              arr2DBoard[objPiecePos.row][intColIndex].animate(
                { left: ((intSize * intColIndex) + "px") },
                200,
                function () { blnInAnimation = false; checkSolved(); }
              );
            }
            else {
              arr2DBoard[objPiecePos.row][intColIndex].css("left", ((intSize * intColIndex) + "px"));
            }
          }
        }
        else if (objPiecePos.col == objEmptyPos.col) {
          if (objPiecePos.row > objEmptyPos.row) {
            for (intRowIndex = objEmptyPos.row; intRowIndex < objPiecePos.row; intRowIndex++) {
              arr2DBoard[intRowIndex][objPiecePos.col] = arr2DBoard[intRowIndex + 1][objPiecePos.col];
            }
            arr2DBoard[intRowIndex][objPiecePos.col] = jEmpty;
          }
          else {
            for (intRowIndex = objEmptyPos.row; intRowIndex > objPiecePos.row; intRowIndex--) {
              arr2DBoard[intRowIndex][objPiecePos.col] = arr2DBoard[intRowIndex - 1][objPiecePos.col];
            }
            arr2DBoard[intRowIndex][objPiecePos.col] = jEmpty;
          }

          for (intRowIndex = 0; intRowIndex < intRows; intRowIndex++) {
            if (blnShowAnimation) {
              blnInAnimation = true;

              arr2DBoard[intRowIndex][objPiecePos.col].animate(
                { top: ((intSize * intRowIndex) + "px") },
                200,
                function () { blnInAnimation = false; checkSolved(); }
              );
            }
            else {
              arr2DBoard[intRowIndex][objPiecePos.col].css("top", ((intSize * intRowIndex) + "px"));
            }
          }
        }

        return false;
      }

      var jContainer = $(this);
      var jImg = jContainer.find("img:first");
      var arr2DBoard = [];
      var intPuzzleWidth = 0;
      var intPuzzleHeight = 0;
      var intSize = intUserSize || 100;
      var intColumns = 0;
      var intRows = 0;
      var blnShowAnimation = false;
      var blnInAnimation = false;

      intSize = Math.floor(intSize);

      if ((intSize < 40) || (intSize > 200)) {
        intSize = 100;
      }

      if (jImg[0].complete) {
        InitPuzzle();
      }
      else {
        jImg.load(
          function () { InitPuzzle(); }
        );
      }

      function startOver() {
        $('#Solved').hide('fast');
        InitPuzzle();
      }

      function checkSolved() {
        var _flag = true;
        var _rand = Math.random();
        var _msg = _rand + "<br />";

        var _Empty = jContainer.find("div[rel='empty']");
        var objEmptyPos = {
          top: parseInt(_Empty.css("top")),
          left: parseInt(_Empty.css("left"))
        }
        objEmptyPos.row = (objEmptyPos.top / intSize);
        objEmptyPos.col = (objEmptyPos.left / intSize);
        //alert(objEmptyPos.row + ", " + objEmptyPos.col);
        for (var msgx = 0; msgx < 3; msgx++) {
          for (var msgy = 0; msgy < 3; msgy++) {
            if (objEmptyPos.row == msgx && objEmptyPos.col == msgy) {

            }
            else {
              if (arr2DBoard[msgx][msgy].x != msgx || arr2DBoard[msgx][msgy].y != msgy) {
                _flag = false;
                _msg += "[" + arr2DBoard[msgx][msgy].x + "][" + arr2DBoard[msgx][msgy].y + " vs [" + msgx + "][" + msgy + "]: " + (arr2DBoard[msgx][msgy].x != msgx) + ", " + (arr2DBoard[msgx][msgy].y != msgy) + "<br />"
              }
            }
            //_msg += "[" + msgx + "][" + msgy + "]: " + (arr2DBoard[msgx][msgy].x == msgx) + ", " + (arr2DBoard[msgx][msgy].y == msgy) + "<br />"
          }
        }
        _solved = _flag;
        //alert(_msg);
        //$("#msg").html(_solved + "<br />" + _msg);
        if (_solved) {
          //alert("congrats!");
          $('#Solved').show('slow');
          $('#btnSkipIt').toggle();
          $('#btnUnSkipIt').toggle();
        }
      }
    }
  );
}
