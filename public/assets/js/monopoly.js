function rollDice() {
    var die1 = document.getElementById("die1");
    var die2 = document.getElementById("die2");
    var status = document.getElementById("status");
    var d1 = Math.floor(Math.random() * 6) + 1;
    var d2 = Math.floor(Math.random() * 6) + 1;
    var diceTotal = d1 + d2;
    die1.innerHTML = d1;
    die2.innerHTML = d2;
    status.innerHTML = "You rolled " + diceTotal + ".";
    if (d1 === d2) {
        status.innerHTML += " Doubles!"
    }
}

// Document.ready
$(function() {
    var currentPlayerId = 1;
    // alert("Player 1's turn!");

    $(".diceBtn").on("click", function(event) {
        // Produce random number
        let die1 = document.getElementById("die1");
        let die2 = document.getElementById("die2");
        let status = document.getElementById("status");
        let d1 = Math.floor(Math.random() * 6) + 1;
        let d2 = Math.floor(Math.random() * 6) + 1;
        let diceTotal = d1 + d2;
        die1.innerHTML = d1;
        die2.innerHTML = d2;
        status.innerHTML = "You rolled " + diceTotal + ".";
        if (d1 === d2) {
            status.innerHTML += " Doubles!"
        }

        // Get player's currentSpace
        $.ajax("/api/players/" + currentPlayerId, {
            type: "GET"
        }).then(function(playerResults) {
            console.log(playerResults);
            let playerSpace = playerResults.currentSpace;
            let playerMoney = playerResults.money;

            //Hide current space piece
            let playerPieces = document.getElementsByClassName(`p` + currentPlayerId);
            console.log(playerPieces);
            for (var i=0; i<playerPieces.length; i++) {
                console.log('hi')
                console.log(playerSpace, playerPieces[i].dataset.id);
                if (playerPieces[i].dataset.id == playerSpace) {
                    console.log(playerPieces[i].dataset.id);
                    playerPieces[i].style.display = "none";
                }
            }

            //Update player space
            playerSpace += diceTotal;
            if (playerSpace > 16) {
                // Player passed Go
                playerSpace -= 16;

                // Add property payouts to player's money
                $.ajax("/api/property", {
                    type: "GET"
                }).then(function(propertyResults) {
                    for (var i=0; i<propertyResults.length; i++) {
                        if (propertyResults[i].foreignKey === currentPlayerId) {
                            playerMoney += propertyResults[i].payout;
                        };
                    }
                })
            }

            //Show player piece on new space
            for (var i=0; i<playerPieces.length; i++) {
                if (playerPieces[i].dataset.id == playerSpace) {
                    playerPieces[i].style.display = "block";
                }
            }

            $(".buyBtn").on("click", function(event) {
                let id = $(this).data("id");
                
                $.ajax("/api/property/" + id, {
                    type: "GET"
                }).then(function(propertyResults) {
                    let price = propertyResults.price;
                    let owned = propertyResults.owned;

                    if (owned===true) {
                        alert("This property is already owned!");
                    } else {
                        // Update owned state
                        let newOwned = {
                            owned: true
                        };
            
                        // Player's id as property's new foreignKey
                        let newForeignKey = {
                            foreignKey: currentPlayerId
                        }
            
                        // Subtract property price from player's money
                        let newMoney = {
                            money: playerMoney - price
                        };
                        
                        // Update player's money
                        $.ajax("/api/players/" + currentPlayerId, {
                            type: "PUT",
                            data: newMoney
                        }).then(function() {
                            // Update property's owned state and foreignKey
                            $.ajax("/api/property/" + id, {
                                type: "PUT",
                                data: [newOwned, newForeignKey],
                            }).then(function() {
                                // Reload the page to get the updated stats
                                location.reload();
                            });
                        })
                    }
            
                })
            })
        
            // Update player turn
            if (currentPlayerId === 1) {
                currentPlayerId = 2;
            } else {
                currentPlayerId = 1;
            }
        })

        // alert(`Player ${currentPlayerId}'s turn!`);
    })
})