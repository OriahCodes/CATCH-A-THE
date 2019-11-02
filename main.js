const localData = LocalData()
const controller = Controller()
const renderer = Renderer()

const initListeners = localData.InitListeners()

//===========================================================================================
//handle first player
//===========================================================================================

function addFirstPlayer(){
    let roomID = ""

    $("#animal-land").empty()

    // (practicing chained promises)
    return controller.generateRoom()
    .then(roomID => { //generate room
        $("#animal-land").append(`<div id='waiting'><div id='code'> your code is: ${roomID}</div> <div> waiting for your game partner </div><div><i class="fas fa-hippo spinning-hippo"></i></div></div>`)
        initListeners.roomListener(roomID) //listen to room
		return controller.addPlayers("player1", roomID) //create player
    }).then (result => { //result = [roomID, playerID]
        initListeners.playerListener(result[1]) //listen to player
        initListeners.levelListner(result[1])
        return controller.addPlayerToRoom(result[0], "player1", result[1]) //add plyer to room
    }).then(roomID => {
        return controller.fullRoomListener(roomID)
    }).then ((full) =>{
        if (full){
            load()
        }
    }).catch(error => {
        console.log("shit: " + error)
    })
}

//===========================================================================================
//handle second player
//===========================================================================================

function getRoomCode(e){
    if (event.keyCode === 13){
        addSecondPlayer()
    }
}

function addSecondPlayer(){
    let atemptedRoomID = $("#code-input").val()
    atemptedRoomID = atemptedRoomID.replace(/\s+/g, ''); //remove white spaces

    db.doc('rooms/' + atemptedRoomID).get().then(room => {
        if(room.exists){
            $("#animal-land").empty()
            initListeners.roomListener(atemptedRoomID) //listen to room
            controller.addPlayers("player2", atemptedRoomID) //create player
            .then (result => { //result = [roomID, playerID]
                initListeners.playerListener(result[1]) //listen to player
                initListeners.levelListner(result[1])
                return controller.addPlayerToRoom(result[0], "player2", result[1]) //adding player to room
            }).then (roomID => {
                controller.fullRoom(roomID)
                load()//should solve this setTimeout issue
            }).catch(error => {
                console.log("shit: " + error)
            })
        }
        else {
            $(".wrong-code").show()
        }
    })   
}

//===========================================================================================
// Load game
//===========================================================================================

let myInterval=[]
let loadInterval = []

function load(){  // load game: 3,2,1 go!

    $("#animal-land").empty()

    let timeLeft = 4
    $("#animal-land").append(`<div id='loading-time'>${timeLeft-1}</div>`)
    
    let loadInterval = setInterval(function(){
        timeLeft --
        if (timeLeft > 1 ){
            $("#loading-time").text(timeLeft-1)
        }
        else if (timeLeft == 1) {
            $("#loading-time").text("go!")
        }
        else if (timeLeft < 1){
            newGame_handler()
            clearInterval(loadInterval)
        }
    },1000)
}

//===========================================================================================
// Timer
//===========================================================================================

let timeLeft = 0

function timer(){

    timeLeft = localData.getLocalInfo().playerInfo.levelDuration / 1000
    console.log(timeLeft)

    $("#time-bar").text(timeLeft + " seconds left")

    myInterval = setInterval(function(){ 
        timeLeft --
        console.log(timeLeft)
        $("#time-bar").text(timeLeft + " seconds left")

        if (timeLeft == 0){ 
            renderer.renderLose()

            $("#animal-land").off("click", ".target", target_handeler) 
            $("#animal-land").find(".target").css({cursor:"default"});

            clearInterval(myInterval) 
        }
    },1000)
}

//===========================================================================================
// Start game
//===========================================================================================

function newGame_handler(){  

    renderer.renderTargets(localData.getLocalInfo())
    renderer.renderGameInfo(localData.getLocalInfo())
    
    timer()

    $("#animal-land").on("click", ".target", target_handeler)
}

function target_handeler(){


    const roomID = localData.getLocalInfo().playerInfo.roomID
    const numPlayer = localData.getLocalInfo().playerInfo.numPlayer

    localData.removeTarget($(this).data().id) 

    let isWinning = localData.checkWin() 

    if (isWinning == true){ 
        $("#my-plus-points").text("+ " + timeLeft).show()
        setTimeout(function(){ $("#my-plus-points").text("+ " + timeLeft).hide()},1000)
        controller._addPoints(roomID, numPlayer, timeLeft) /////////////////////////////////////////
        clearInterval(myInterval)
        //points rendered from localData

        // renderer.renderWin()
        controller._levelUp(roomID, numPlayer).then(function(){
            console.log("level updated!")
                timer()     
        }).catch(function(error){
            console.log("Got an error:" , error)
        })

    }
}
