/**
*
* @Author Max An
* @Date  February 7 
*
* sudoku on jQuery
* 
*/

var zeroMatrix = [
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 3, 4, 5, 6, 7, 8, 9, 1],
                    [5, 6, 7, 8, 9, 1, 2, 3, 4],
                    [8, 9, 1, 2, 3, 4, 5, 6, 7],
                    [3, 4, 5, 6, 7, 8, 9, 1, 2],
                    [6, 7, 8, 9, 1, 2, 3, 4, 5],
                    [9, 1, 2, 3, 4, 5, 6, 7, 8]],
            orgMatrix, orgFullMatrix,
            curMatrix;
$(document).ready(function () {
    updateTable(clearCell(1, randMatrix(zeroMatrix)), true);
    //mCheck(randMatrix(zeroMatrix));
    $('.col-md-1').click(function () {
        if (!$(this).hasClass('orgCell') && !$(this).hasClass('correctCell')) {
            $('.clickedCell').removeClass('clickedCell');
            $(this).addClass('clickedCell');
        }
    });
    $(document).keyup(function (e) {
        var keycode = e.which,
                    valid =
                    (keycode > 48 && keycode < 58) || // number keys
                    keycode == 46 || // delete
                    (keycode > 96 && keycode < 106), // numpad
                    cellID;
        if ($('.clickedCell').get(0) != undefined && valid) {
            cellID = [parseInt($('.clickedCell').attr('id').substring(1).split('_')[0]), parseInt($('.clickedCell').attr('id').substring(1).split('_')[1])];
            $('.clickedCell').removeClass('wrongCell');
            if (keycode == 46) {
                curMatrix[cellID[0]][cellID[1]] = undefined;
                updateTable(curMatrix);
            }
            else {
                curMatrix[cellID[0]][cellID[1]] = parseInt(String.fromCharCode(keycode > 58 ? (keycode - 48) : keycode));
                updateTable(curMatrix);
                mFullCheck(curMatrix);
            }
        }
    });
    $('.newGame').click(function () {
        var res = confirm("Are sure that you want to start new game?")
        if (res == true) {
            var nMat = parseInt($(this).data('level'));
            setTimeout(function () {
                updateTable(clearCell(nMat, randMatrix(zeroMatrix)), true);
            }, 200);
        }
    });
    $('#restartBtn').click(function () {
        var res = confirm("Are sure that you want to restaer the game?")
        if (res == true) {
            setTimeout(function () {
                updateTable(orgMatrix);
                $('.clickedCell').removeClass('clickedCell');
            }, 200);
        }
    });
    $('#hintBtn').click(function () {
        var randI,
                    randJ;
        do {
            randI = randomBtwNumbers(0, 8),
                    randJ = randomBtwNumbers(0, 8);
        }
        while (curMatrix[randI][randJ] != undefined);
        curMatrix[randI][randJ] = orgFullMatrix[randI][randJ];
        updateTable(curMatrix);
    });
});
function randMatrix(mat) {
    curMatrix = $.extend(true, [], mat);
    var kindOfMix;
    for (i = 0; i < 20; i++) {
        kindOfMix = randomBtwNumbers(0, 2);
        if (kindOfMix == 0)
            curMatrix = transportM(curMatrix);
        else if (kindOfMix == 1)
            curMatrix = mixLines(curMatrix);
        else
            curMatrix = mixBlocks(curMatrix);
    }
    return curMatrix;
}
function clearCell(level, mat) {
    orgFullMatrix = $.extend(true, [], mat);
    var nCells = ((level == 0) ? randomBtwNumbers(35, 40) : ((level == 1) ? randomBtwNumbers(25, 30) : randomBtwNumbers(18, 25))),
                counter = 0;
    do {
        var randI = randomBtwNumbers(0, 8),
                    randJ = randomBtwNumbers(0, 8);
        if (mat[randI][randJ] != undefined) {
            mat[randI][randJ] = undefined;
            ++counter;
        }
    }
    while ((81 - counter) > nCells);
    orgMatrix = $.extend(true, [], mat);
    return mat;
}
function transportM(mat) {
    var tempDr,
                k = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = k; j < 9; j++) {
            tempDr = mat[i][j];
            mat[i][j] = mat[j][i];
            mat[j][i] = tempDr;
        }
        ++k;
    }
    return mat;
}
function mixLines(mat) {
    var rc = randomBtwNumbers(0, 1),
                rndDetails = [randomBtwNumbers(0, 2), randomBtwNumbers(0, 2)], // block, line1, line2
                kTemp = [0, 1, 2],
                tempLine = [];
    kTemp.splice(kTemp.indexOf(rndDetails[1]), 1);
    rndDetails.push(kTemp[Math.floor(Math.random() * kTemp.length)]);
    for (var i = 0; i < 9; i++) {
        tempLine[i] = mat[(rc == 1 ? (rndDetails[0] * 3 + rndDetails[1]) : i)][(rc == 0 ? (rndDetails[0] * 3 + rndDetails[1]) : i)];
        mat[(rc == 1 ? (rndDetails[0] * 3 + rndDetails[1]) : i)][(rc == 0 ? (rndDetails[0] * 3 + rndDetails[1]) : i)] =
                mat[(rc == 1 ? (rndDetails[0] * 3 + rndDetails[2]) : i)][(rc == 0 ? (rndDetails[0] * 3 + rndDetails[2]) : i)];
        mat[(rc == 1 ? (rndDetails[0] * 3 + rndDetails[2]) : i)][(rc == 0 ? (rndDetails[0] * 3 + rndDetails[2]) : i)] = tempLine[i];
    }
    return mat;
}
function mixBlocks(mat) {
    var rc = randomBtwNumbers(0, 1),
                rndDetails = [randomBtwNumbers(0, 2)], // block1, block2
                kTemp = [0, 1, 2],
                tempBlock = [];
    kTemp.splice(kTemp.indexOf(rndDetails[0]), 1);
    rndDetails.push(kTemp[Math.floor(Math.random() * kTemp.length)]);
    for (var i = 0; i < 9; i++) {
        tempBlock[i] = new Array(9);
    }
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 9; j++) {
            tempBlock[(rc == 1 ? i : j)][(rc == 0 ? i : j)] =
                    mat[(rc == 1 ? (rndDetails[0] > 0 ? (i + rndDetails[0] * 3) : i) : j)][(rc == 0 ? (rndDetails[0] > 0 ? (i + rndDetails[0] * 3) : i) : j)];
            mat[(rc == 1 ? (rndDetails[0] > 0 ? (i + rndDetails[0] * 3) : i) : j)][(rc == 0 ? (rndDetails[0] > 0 ? (i + rndDetails[0] * 3) : i) : j)] =
                    mat[(rc == 1 ? (rndDetails[1] > 0 ? (i + rndDetails[1] * 3) : i) : j)][(rc == 0 ? (rndDetails[1] > 0 ? (i + rndDetails[1] * 3) : i) : j)];
            mat[(rc == 1 ? (rndDetails[1] > 0 ? (i + rndDetails[1] * 3) : i) : j)][(rc == 0 ? (rndDetails[1] > 0 ? (i + rndDetails[1] * 3) : i) : j)] =
                    tempBlock[(rc == 1 ? i : j)][(rc == 0 ? i : j)];
        }
    }
    return mat;
}
function randomBtwNumbers(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function mCheck(mat) {
    var mReaady = true;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (getAvailableA([i, j], mat[i][j], mat))
                mReaady = false;
        }
    }
    if (mReaady)
        console.log('Matrix is Good');
    else
        console.log('Matrix is Bad');
}
function mFullCheck(mat) {
    var full = true,
                mGood = true;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (mat[i][j] == undefined) {
                full = false;
                break;
                break;
            }
        }
    }
    if (full) {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (mat[i][j] != orgFullMatrix[i][j]) {
                    $('#c' + i + '_' + j).addClass('wrongCell');
                    mGood = false;
                }
            }
        }
        if (mGood)
            alert('Congratulations!');
    }

}
function getAvailableA(pos, el, mat) {
    var col = pos[0],
                row = pos[1],
                blockPos = [~ ~(col / 3), ~ ~(row / 3)],
                zeroPos = [0, 0],
                returnMe = true;
    for (var i = 0; i < 2; i++) {
        if (blockPos[i] == 1)
            zeroPos[i] = 3;
        else if (blockPos[i] == 2)
            zeroPos[i] = 6;
    }
    //console.log('zeropos: ' + zeroPos);
    for (var i = 0; i < 9; i++) {
        var checkElc = (mat[col][i] == undefined ? 0 : mat[col][i]);
        if (mat[col][i] == el) {
            returnMe = false;
        }
    }
    //console.log('posOnCol: ' + possibleN);
    for (var j = 0; j < 9; j++) {
        var checkElr = (mat[j][row] == undefined ? 0 : mat[j][row]);
        if (mat[j][row] == el) {
            returnMe = false;
        }
    }
    //console.log('posOnRow: ' + possibleN);
    for (var i = zeroPos[0]; i < zeroPos[0] + 3; i++) {
        for (var j = zeroPos[1]; j < zeroPos[1] + 3; j++) {
            var checkEl = (mat[i][j] == undefined ? 0 : mat[i][j]);
            if (mat[i][j] == el) {
                returnMe = false;
            }
        }
    }
    //console.log('posOnBlock: ' + possibleN);
    return returnMe;
}
function getAvailable(pos, mat) {
    var col = pos[0],
                row = pos[1],
                tempMat = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                blockPos = [~ ~(col / 3), ~ ~(row / 3)],
                zeroPos = [0, 0];
    //console.log('blockPos: ' + blockPos);

    for (var i = 0; i < 2; i++) {
        if (blockPos[i] == 1)
            zeroPos[i] = 3;
        else if (blockPos[i] == 2)
            zeroPos[i] = 6;
    }
    //console.log('zeropos: ' + zeroPos);
    // Checking column
    for (var i = 0; i < 9; i++) {
        var checkElc = (mat[col][i] == undefined ? 0 : mat[col][i]);
        if (tempMat.indexOf(checkElc) > -1) {
            tempMat.splice(tempMat.indexOf(checkElc), 1);
        }
    }
    //console.log('posOnCol: ' + tempMat);
    // Checking row
    for (var j = 0; j < 9; j++) {
        var checkElr = (mat[j][row] == undefined ? 0 : mat[j][row]);
        if (tempMat.indexOf(checkElr) > -1) {
            tempMat.splice(tempMat.indexOf(checkElr), 1);
        }
    }
    //console.log('posOnRow: ' + tempMat);
    // Checking 3x3 block
    for (var i = zeroPos[0]; i < zeroPos[0] + 3; i++) {
        for (var j = zeroPos[1]; j < zeroPos[1] + 3; j++) {
            var checkEl = (mat[i][j] == undefined ? 0 : mat[i][j]);
            if (tempMat.indexOf(checkEl) > -1) {
                tempMat.splice(tempMat.indexOf(checkEl), 1);
            }
        }
    }
    //console.log('posOnBlock: ' + tempMat);
    return tempMat;
}
function updateTable(mat, original) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (original)
                $('#c' + i + '_' + j).removeClass('orgCell');
            if (mat[i][j] != undefined) {
                $('#c' + i + '_' + j).find('span').html(mat[i][j]);
                if (original)
                    $('#c' + i + '_' + j).addClass('orgCell');
            }
            else {
                $('#c' + i + '_' + j).find('span').html('');
            }
        }
    }
}
