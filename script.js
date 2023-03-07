const nextButton = document.querySelector('#nextButton');
nextButton.addEventListener('click', gameRound);

window.onclick = e => {
    if (counter == 0) {
        if (e.target.id.startsWith('b')) {
            let tile = e.target.id.substring(1).split('-');
            let nInfected = document.querySelector('.nInfected').children[1];
            let tInfected = document.querySelector('.tInfected').children[1];
            if (board[parseInt(tile[0])][parseInt(tile[1])] === 0) {
                board[parseInt(tile[0])][parseInt(tile[1])] = -1;
                nInfected.textContent = parseInt(nInfected.textContent) - 1;
                totalInfected--;
                tInfected.textContent = totalInfected;
                e.target.firstElementChild.textContent = '';
                e.target.style.background = '';
            }
            else {
                board[parseInt(tile[0])][parseInt(tile[1])] = 0;
                nInfected.textContent = parseInt(nInfected.textContent) + 1;
                totalInfected++;
                tInfected.textContent = totalInfected;
                e.target.firstElementChild.textContent = '0';
                e.target.style.background = 'green';
            }
            /*let num = document.createElement('p');
            num.textContent = '0';
            temp.appendChild(num);
            temp.style.background = 'green';*/
        }
    }
}

function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}

var probability = 1;
function setProbability() {
    probability = 1;
    if(document.querySelector('#handwashing').checked) {
        probability *= .81;
    }
    if(document.querySelector('#vaccine').checked) {
        probability *= .05;
    }
    
}
function checkInfected() {
    if (Math.random() / probability <= 1) {
        return true;
    }
    return false;
}

var counter = 0;
var totalInfected = 0;
var weight = 0;
var tJumps = 0;
var sJumps = 0;
function gameRound() {
    setProbability();
    if (totalInfected != 625) {
        let currentInfected = totalInfected;
        counter++;
        let iTiles = Array(0);
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                if (board[i][j] != -1) {
                    iTiles.push(i + ' ' + j);
                }
            }
        }
        iTiles.forEach(t => {
            let temp = t.split(' ');
            let x = parseInt(temp[0]);
            let y = parseInt(temp[1]);
            for (let i = -1; i <= 1; i++) {
                let tx = x + i;
                if ((tx >= 0) && (tx < 25)) {
                    for (let j = -1; j <= 1; j++) {
                        let ty = y + j;
                        if ((ty >= 0) && (ty < 25)) {
                            if (board[tx][ty] == -1) {
                                if (checkInfected()) {
                                    board[tx][ty] = counter;
                                    totalInfected++;
                                    document.querySelector('#b' + tx + '-' + ty).firstElementChild.textContent = counter;
                                    let result = pickHex([255, 255, 0], [255, 0, 0], weight / 15);
                                    document.querySelector('#b' + tx + '-' + ty).style.background = 'rgb(' + result.join() + ')';
                                }

                            }
                        }
                    }
                }
            }
        });
        for (let i = currentInfected; i >= 50; i -= 50) {
            tJumps++;
            let x = Math.floor(Math.random() * (24 - 0 + 1)) + 0;
            let y = Math.floor(Math.random() * (24 - 0 + 1)) + 0;
            if (board[x][y] == -1 && checkInfected()) {
                sJumps++;
                board[x][y] = counter;
                totalInfected++;
                document.querySelector('#b' + x + '-' + y).firstElementChild.textContent = counter;
                document.querySelector('#b' + x + '-' + y).style.background = 'blue';
            }
        }
        if (probability > .5) {
            weight += probability;
        }
        else {
            weight += 5 * probability;
        }
        
        let t = document.createElement('p');
        t.textContent = counter;
        document.querySelector('.time').appendChild(t);
        let ni = document.createElement('p');
        ni.textContent = totalInfected - currentInfected;
        document.querySelector('.nInfected').appendChild(ni);
        let tj = document.createElement('p');
        tj.textContent = tJumps;
        document.querySelector('.tJumps').appendChild(tj);
        let sj = document.createElement('p');
        sj.textContent = sJumps;
        document.querySelector('.sJumps').appendChild(sj);
        let ti = document.createElement('p');
        ti.textContent = totalInfected;
        document.querySelector('.tInfected').appendChild(ti);
    }
}

var board = new Array(25);
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(25);
    for (let j = 0; j < board[i].length; j++) {
        board[i][j] = -1;
    }
}