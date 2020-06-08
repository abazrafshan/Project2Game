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
            for (var i=0; i<playerPieces.length; i++) {
                if (playerPieces[i].dataset.id == playerSpace) {
                    playerPieces[i].style.display = "none";
                }
            }

            //Update player space
            playerSpace += diceTotal;

            // Account for passing GO
            let newPlayerSpace = playerSpace>16 ? {currentSpace: playerSpace-16} : {currentSpace: playerSpace}

            //Show player piece on new space
            for (var i=0; i<playerPieces.length; i++) {
                if (playerPieces[i].dataset.id == newPlayerSpace.currentSpace) {
                    playerPieces[i].style.display = "block";
                }
            }

            // Put method to update player's currentSpace
            $.ajax({
                type: "PUT",
                data: newPlayerSpace,
                url: "/api/players/" + currentPlayerId
            }).then(function() {
                if (playerSpace>16) {
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
            });

            $(".buyBtn").on("click", function(event) {
                let id = $(this).data("id");
                
                $.ajax("/api/property/" + id, {
                    type: "GET"
                }).then(function(propertyResults) {
                    console.log(propertyResults);
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
                        $.ajax({
                            type: "PUT",
                            data: newMoney,
                            url: "/api/players/" + currentPlayerId
                        }).then(function() {
                            // Update property's owned state and foreignKey
                            $.ajax({
                                type: "PUT",
                                data: [newOwned, newForeignKey],
                                url: "/api/property/" + id
                            }).then(function() {
                                //Buy button disappear
                                let buyButtons = document.getElementsByClassName("buyBtn");
                                for (var i=0; i<buyButtons.length; i++) {
                                    if (buyButtons[i].dataset.id == newPlayerSpace) {
                                        buyButtons[i].style.display = "none";
                                    }
                                }
                            });
                        })  
                    }
            
                })
                // Update player turn
                if (currentPlayerId === 1) {
                    currentPlayerId = 2;
                } else {
                    currentPlayerId = 1;
                }
            })
        
        })

        // End turn button on click
    })

})