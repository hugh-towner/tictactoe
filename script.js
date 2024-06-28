const board = Array(9).fill('');
let turn = 'x';


function clickBox(boxNum){
    if(document.getElementById('message').innerHTML.includes('wins') || document.getElementById('message').innerHTML.includes('draw')){
        resetGame();
        return;
    }

    var box = document.getElementById("box"+boxNum);
    
    if(board[boxNum] === ''){
        board[boxNum] = turn;
        box.innerHTML = turn.toUpperCase();
        turn = turn === 'x' ? 'o' : 'x';
        document.getElementById('message').innerHTML = turn.toUpperCase() + "'s turn";

    }
    console.log(board);
    checkWinner();
}

function resetGame(){
    board.fill('');
    document.querySelectorAll('[id^="box"]').forEach(box => {
        box.innerHTML = '';
        box.style.backgroundColor = 'lightcoral';
    });
    turn = 'x';
    document.getElementById('message').innerHTML = turn.toUpperCase() + "'s turn";
}

function winner(combo){
    document.getElementById('message').innerHTML = board[combo[0]].toUpperCase() + " wins!";
    combo.forEach(index => {
        document.getElementById('box'+index).style.backgroundColor = 'lightseagreen';
    });
}

function checkWinner(){
    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8], //rows
        [0,3,6], [1,4,7], [2,5,8], //columns
        [0,4,8], [2,4,6] //diagonals
    ];

    for(const combo of winningCombos){
        const [a, b, c] = combo;
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            winner(combo);
            return;
        }
    }

    if(board.every(box => box !== '')){
        document.getElementById('message').innerHTML = "It's a draw!";
    }
}