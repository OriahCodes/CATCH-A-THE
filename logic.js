const Controller = function(){

    var db = firebase.firestore()

    function generateRoom(){
        return new Promise(resolve => { 
            const roomID = Math.random().toString(36).substr(2, 6)
            db.doc('rooms/' + roomID).set({
                startTimeStamp : 0,
                roomStatus : "empty",
                scoreCount : {
                    player1: 0,
                    player2: 0
                }
            }).then(function(){
                console.log("room " + roomID + " adeed!")
                resolve(roomID)
            }).catch(error => {
                console.log( "error in generating room: " +error)
            })
        })
    }
    
    function addPlayers(numPlayer, roomID){
        return new Promise(resolve => { 
            db.collection('players').add({

                roomID: roomID,
                numPlayer : numPlayer,
                totalScore: 0,
                targetsLeft: 0, //depends on the size of _game.targets?
           
            }).then((docRef) =>{

                playerID = docRef.id
                console.log(numPlayer + " created! id: " + playerID)
                db.doc('players/' + playerID + '/levelInfo/level').set({
                    level: 1,
               
                }).then(() =>{
                    resolve([roomID, playerID]) // {roomID : roomID, playerID: playerID})
                }).catch(() => console.log("problem addind lvel info"))
            
            }).catch(function(error) {
            console.error("Error adding playr: ", error)
            })
        })
    }

    function addPlayerToRoom(roomID, numPlayer, playerID){  
        return new Promise(resolve => {      
            
            db.doc('rooms/' + roomID + '/players/' + numPlayer ).set({      
                playerInfoRef: db.doc('players/' + playerID ),
                levelInfoRef: db.doc('players/' + playerID + '/levelInfo/level' )
            
            }).then(function(){
                console.log(numPlayer , playerID + " added to room " + roomID + " successfully")
                resolve(roomID)

            }).catch(function(error) {
            console.error("Error adding player" + playerID + " to room: " + roomID , error)
            })
        })
    }

    function deletePlayer(gameInfo){
        db.collection('players').doc(gameInfo.id).delete().then(function() {
            console.log("player " + gameInfo.id + " successfully deleted from Players collection!");
        }).catch(function(error) {
            console.error("Error removing player: ", error);
        });
    
        db.doc('rooms/' + gameInfo.roomID + '/players/' + gameInfo.numPlayer).delete().then(function() {
            console.log("player " + gameInfo.id + " successfully deleted from rooms collection!");
        }).catch(function(error) {
            console.error("Error removing player: ", error);
        });
    }

    function fullRoomListener(roomID){ 
        return new Promise (resolve => {
            StopFulllRoomListener =  db.doc('rooms/' + roomID).onSnapshot((roomSnapShot) => {
                if(roomSnapShot.data() && (roomSnapShot.data().roomStatus == "full")){
                    resolve(roomID) 
                    console.log(roomID + " is full!")
                    StopFulllRoomListener()   
                }
            })
        })
    }  

    function RoomStatusListener(roomID){
        return new Promise (resolve => {
            stopRoomStatusListener =  db.doc('rooms/' + roomID).onSnapshot((roomSnapShot) => {
                if(roomSnapShot.data() && ((roomSnapShot.data().roomStatus == "player1-left") || (roomSnapShot.data().roomStatus == "player2-left"))){
                    let playerLeft = roomSnapShot.data().roomStatus.replace("-left", "")
                    resolve(playerLeft)
                    console.log("one player left in room " + roomID)
                    stopRoomStatusListener()   
                }
            })
        })
    }  

    function updateRoomStatus(roomID, status){
        db.doc('rooms/' + roomID).update({
            roomStatus : status,
        }).then(function(){
            console.log(roomID + " room status: " + status)
        })
    }
    
    function levelUpDB(roomID, numPlayer){
        const incrementlevel = firebase.firestore.FieldValue.increment(1);
        return db.doc('rooms/' + roomID + '/players/' + numPlayer).get().then(player=> {
            player.data().levelInfoRef.update({
                level: incrementlevel,
            }).then(() => {
                console.log("level updated!")
            }).catch(function(error){
                console.log("Got an error:" , error)
            })
        })

    }

    function addPoints(roomID, numPlayer, numPoints){
        const incrementPoints = firebase.firestore.FieldValue.increment(numPoints);
        
        db.doc('rooms/' + roomID).update({
            ['scoreCount.'+ numPlayer]: incrementPoints,
        }).then(function(){
            console.log("Points added!")
        }).catch(function(error){
            console.log("Got an error:" , error)
        })
    }


    return{
        generateRoom: generateRoom,
        addPlayers: addPlayers,
        addPlayerToRoom: addPlayerToRoom,
        deletePlayer: deletePlayer,

        fullRoomListener: fullRoomListener,
        RoomStatusListener: RoomStatusListener,
        updateRoomStatus: updateRoomStatus,

        levelUpDB: levelUpDB,
        addPoints: addPoints,
    }

}


