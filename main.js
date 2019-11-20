const localData = LocalData()
const controller = Controller()
const renderer = Renderer()

const initListeners = localData.InitListeners()

//===========================================================================================
//handle first player
//===========================================================================================

function addFirstPlayer(){
    // let roomID = ""

    $("#animal-land").empty()

    // (practicing chained promises)
    return controller.generateRoom()
    .then(roomID => { //generate room
        $("#animal-land").append(`<div id='waiting'><div id='code'> your code is: <div class="room-id">${roomID}</div></div> <div> waiting for your game partner </div><div><i class="fas fa-hippo spinning-hippo"></i></div></div>`)
        initListeners.roomListener(roomID) //listen to room
		return controller.addPlayers("player1", roomID) //create player
    }).then (result => { //result = [roomID, playerID]
        initListeners.playerListener(result[1]) //listen to player
        initListeners.levelListner(result[1])
        return controller.addPlayerToRoom(result[0], "player1", result[1]) //add plyer to room
    }).then(roomID => {
        controller.updateRoomStatus(roomID, "waiting")
        return controller.fullRoomListener(roomID)
    }).then ((roomID) =>{
        load()
        return controller.RoomStatusListener(roomID)
    }).then ((playerLeft) =>{
        if (playerLeft != "player1"){
            proceedAloneMessage()
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
                controller.updateRoomStatus(roomID, "full")
                load()//should solve this setTimeout issue
                return controller.RoomStatusListener(roomID)
            }).then ((playerLeft) =>{
                if (playerLeft != "player2"){
                    proceedAloneMessage()
                }
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
let myInterval=[]
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
            $("#animal-land").off("click", ".target", target_handler) 
            $("#animal-land").find(".target").css({cursor:"default"});

            $("#animal-land").append(`<div class='game-message' id='out-of-time'><div class='big-font'>uh oh!</div>
            <div class='medium-font'>you ran out of time. would you like to restart the level and keep playing? <div class='small-font'>quick! your competitor is beating you!
            <div class='answer' onclick='RestartLevel()'>YES</div><div class='answer' style='color: #16a085' onclick='loser()'>What a shame. let me out of here</div></div></div></div>`)


            clearInterval(myInterval) 
        }
    },1000)
}

//===========================================================================================
// Handle game messages
//===========================================================================================

function loser(){
    $("#animal-land").empty().append(`<div id='loser' class='game-message'><div class='large-font'>LOSER</div><i class="fas fa-poo poop"></i></div>`)
    quit()
}

function okBye(){
    $("#animal-land").empty().append(`<div id='bye' class='game-message'><div class='large-font'><div class='big-font'>Thanks for Playing!</div><div class='small-font'>Come back later for some more Dopamine</div></div><i class="fas fa-laugh-wink wink"></i></div>`)
    quit() 
}

function RestartLevel(){
    $("#animal-land").empty()
    localData.restartLevel(localData.getLocalInfo().playerInfo.level)
    newGame_handler()
}

function proceedAloneMessage(){
    // pause timer
    clearInterval(myInterval) 

    $("#animal-land").off("click", ".target", target_handler) 
    $("#animal-land").find(".target").css({cursor:"default"});
    $("#animal-land").append(`<div class='game-message' id='proceed-alone'>Your competitor left the game. Would you like to continue catching things anyway?<div class='answer'>YEAH</div><div onclick='okBye()' class='answer' style='color: #16a085'>Nah</div>`)
}

function quit(){
    controller.deletePlayer(localData.getLocalInfo().playerInfo)
    let playerLeft = localData.getLocalInfo().playerInfo.numPlayer + "-left"
    controller.updateRoomStatus(localData.getLocalInfo().playerInfo.roomID, playerLeft)

    //note : if room empty -delete 
}

//===========================================================================================
// Start game
//===========================================================================================

function newGame_handler(){  

    renderer.renderTargets(localData.getLocalInfo())
    renderer.renderGameInfo(localData.getLocalInfo())
    
    timer()

    $("#animal-land").on("click", ".target", target_handler)
}

function target_handler(){


    const roomID = localData.getLocalInfo().playerInfo.roomID
    const numPlayer = localData.getLocalInfo().playerInfo.numPlayer

    localData.removeTarget($(this).data().id) 

    let isWinning = localData.checkWin() 

    if (isWinning == true){ 
        $("#my-plus-points").text("+ " + timeLeft).show()
        setTimeout(function(){ $("#my-plus-points").text("+ " + timeLeft).hide()},1000)
        controller.addPoints(roomID, numPlayer, timeLeft)
        clearInterval(myInterval)

        controller.levelUpDB(roomID, numPlayer).then(function(){
            setTimeout(function(){
                timer() 
            }, 50)
        }).catch(function(error){
            console.log("Got an error:" , error)
        })

    }
}
