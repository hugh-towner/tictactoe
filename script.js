const board = Array(9).fill('');
let turn = 'x';
playing = false;
myID = null;


function clickBox(boxNum){
    if(!playing) return;

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

conn = null

function initialize(role) {
    peer = new Peer();

    peer.on('open', function (id) {
        console.log('ID: ' + peer.id);

        if (role == "host"){
            myID = id;
            document.getElementById("current-game-id").innerHTML = id;

        } else if (role == "client"){
        joinId = window.prompt("Enter the game ID");
        join(joinId);
        }


    });
    peer.on('connection', function (c) {
        if (role == "client"){

            c.on('open', function() {
                c.send("Client does not accept incoming connections");
                setTimeout(function() { c.close(); }, 500);
            });

            
        } else if (role == "host"){
            if (conn && conn.open) {
                c.send("Already connected to another client");
                return;
            }

            conn = c;
            console.log("Connected to: " + conn.peer);
            Ready();
            
        }
    });
    peer.on('disconnected', function () {
        console.log('Connection lost. Please reconnect');

        peer.reconnect();
    });
    peer.on('close', function() {
        conn = null;
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
};

function join(id) {
    console.log("Joining: " + id);
    if (conn) {
        conn.close();
    }

    conn = peer.connect(id, {
        reliable: true
    });

    conn.on('open', function () {
        console.log("Connected to: " + conn.peer);
        conn.send("testing")
    });
    conn.on('close', function () {
    });
};

function Ready() {
    console.log("Ready");
    conn.on('data', function (data) {
        console.log('Received', data);
    });
}


// if(window.location.hash) {
//     initialize("client");
//   } else {
//     initialize("host");   
//   }

function createGame(){
    initialize("host");
    document.getElementsByClassName("welcome")[0].classList.add("create");
    document.getElementById('message').innerHTML = "Waiting for client to join...";
}