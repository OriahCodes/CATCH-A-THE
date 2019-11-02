const Controller = function(){
    const localData = LocalData

    _targetTypes = ["fish", "hippo", "kiwi-bird", "dog", "horse", "cat", "spider", "frog", "dragon"]

    var db = firebase.firestore()

    
    function generateRoom(){
        return new Promise(resolve => { //generates room , adds player1 and returns roomID
            const roomID = Math.random().toString(36).substr(2, 6)
            db.doc('rooms/' + roomID).set({
                startTimeStamp : 0,
                isFull : false,
                scoreCount : {
                    player1: 0,
                    player2: 0
                }
            }).then(function(){
                console.log("room " + roomID + " adeed!")
                resolve(roomID)
                // addPlayers("player1", roomID)
                // callback(roomID)
            }).catch(error => {
                console.log( "error in generating room: " +error)
            })
        })
    }
    
    function addPlayers(numPlayer, roomID){
        return new Promise(resolve => { //generates new player in Players collection 
            db.collection('players').add({
                roomID: roomID,
                numPlayer : numPlayer,
                totalScore: 0,
                // level: 0,
                targetsLeft: 0, //depends on the size of _game.targets?
            }).then((docRef) =>{
                playerID = docRef.id
                console.log(numPlayer + " created! id: " + playerID)
                db.doc('players/' + playerID + '/levelInfo/level').set({
                    level: 1,
                }).then(() =>{
                    resolve([roomID, playerID]) //{roomID : roomID, playerID: playerID})
                //   addPlayerToRoom(roomID, numPlayer, playerID)
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
                // db.doc('rooms/' + roomID).collection('/players').get().then(snapShot => {
                //     if (snapShot.size == 2){
                //         fullRoom(roomID)
                //         readyToStartGame = true
                //     }
                //     else {
                //         readyToStartGame = false
                //     }
                // }).then(() => {
                    resolve(roomID)
                // })     
            }).catch(function(error) {
            console.error("Error adding player" + playerID + " to room: " + roomID , error)
            })
        })
    }

    function fullRoomListener(roomID){ //if room is full -> start game

        return new Promise (resolve => {
            let full = false
            StopFulllRoomListener =  db.doc('rooms/' + roomID).onSnapshot((roomSnapShot) => {
                if(roomSnapShot.data() && roomSnapShot.data().isFull){
                    full = true
                    resolve(full) 
                    console.log(roomID + " is full!")
                    StopFulllRoomListener()   
                }
            })
        })
    }  

    function fullRoom(roomID){
        db.doc('rooms/' + roomID).update({
            isFull : true,
        }).then(function(){
            console.log("room " + roomID + "  is full!")
        })
    }
    
    
    
    function _newGame(roomID, numPlayer) {
        // db.doc('rooms/' + roomID + '/players/' + numPlayer).get().then(player=> {
        //     player.data().idRef.update({
        //         level: 1,
        //         targetsLeft: 1
        //     }).then(function(){
        //         console.log("New game started for " +numPlayer)
        //     }).catch(function(error){
        //         console.log("Got an error in initializign game:"  , error)
        //     })
        // })
    }

    let info = []
    function _getInfo(roomID, playerID){
        return db.doc('rooms/' + roomID + '/players/' + playerID).get().then((snapshot) =>{
            info = snapshot.data()
        }).then(function(){
            return info
        }).catch(function(error){
            console.log("Got an error:"  , error)
        })
    }

    function _levelUp(roomID, numPlayer){

        const incrementlevel = firebase.firestore.FieldValue.increment(1);
        return db.doc('rooms/' + roomID + '/players/' + numPlayer).get().then(player=> {
            player.data().levelInfoRef.update({
                level: incrementlevel,
                // targetsLeft: 0,
            })
            // .then(function(){
            //     console.log("level updated!")
            // }).catch(function(error){
            //     console.log("Got an error:" , error)
            // })
        })

    }

    let isWin = []
    function _checkWin (roomID, playerID){
        return db.doc('rooms/' + roomID + '/players/' + playerID).get()
        
        // .then((snapshot) =>{
        //     isWin = snapshot.data().targets
        // // }).then(function(){
        //     if (isWin.length == 0){
        //         console.log("win!'")
        //         return true
        //     }
        //     return false
        // }).catch(function(error){
        //     console.log("Got an error:" , error)
        // })
    }

    function _addPoints(roomID, numPlayer, numPoints){
        const incrementPoints = firebase.firestore.FieldValue.increment(numPoints);
        // let scoreUpdate = {}
        // scoreUpdate[`${numPlayer}`] 
        db.doc('rooms/' + roomID).update({
            ['scoreCount.'+ numPlayer]: incrementPoints,
        }).then(function(){
            console.log("Points added!")
        }).catch(function(error){
            console.log("Got an error:" , error)
        })
    }
///-------------------------------------------------------------------------//

    // const newGame = function(){ 
    //     addTargets(1)
    //     _game.level = 1
    //     targetType =  0
    //     _game.levelDuration = 2000
    // }


    // const checkWin = function(){
    //     if (_game.targets == ""){
    //         return true
    //     }
    //     return false
    // }

    // return{
    //     newGame: newGame,
    //     getInfo: getInfo,
    //     addTargets: addTargets,
    //     removeTarget: removeTarget,
    //     checkWin: checkWin, 
    //     levelUp: levelUp,


    return{
        addPlayers: addPlayers,
        generateRoom: generateRoom,
        addPlayerToRoom: addPlayerToRoom,
        fullRoom: fullRoom,
        fullRoomListener: fullRoomListener,

        _newGame: _newGame,
        _levelUp: _levelUp,
        _addPoints: _addPoints,
    }

}


