// Document.ready
$(function() {
    var currentPlayerId = 1;
    //Need div to append whose turn it is

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
            let playerSpace = playerResults.currentSpace;
            let playerMoney = playerResults.money;

            //Hide current space piece
            let playerPieces = document.getElementsByClassName(`p` + currentPlayerId);
            for (let i=0; i<playerPieces.length; i++) {
                if (playerPieces[i].dataset.id == playerSpace) {
                    playerPieces[i].style.display = "none";
                }
            }

            //Update player space
            playerSpace += diceTotal;

            // Account for passing GO
            let newPlayerSpace = playerSpace>16 ? playerSpace-16 : playerSpace

            //Show player piece on new space
            for (let i=0; i<playerPieces.length; i++) {
                if (playerPieces[i].dataset.id == newPlayerSpace) {
                    playerPieces[i].style.display = "block";
                }
            }

            // Put method to update player's currentSpace
            $.ajax({
                type: "PUT",
                data: {currentSpace: newPlayerSpace},
                url: "/api/players/" + currentPlayerId
            }).then(function() {
                // If passed Go, add property payouts to player's money
                if (playerSpace>16) {
                    $.ajax("/api/property", {
                        type: "GET"
                    }).then(function(propertyResults) {
                        for (let i=0; i<propertyResults.length; i++) {
                            if (propertyResults[i].foreignKey === currentPlayerId) {
                                playerMoney += propertyResults[i].payout;
                            };
                        }
                        //Update player's money
                        $.ajax({
                            type: "PUT",
                            data: {money: playerMoney},
                            url: "/api/players/" + currentPlayerId
                        })
                    })
                };
                
                // Pickpocketing if player lands on property where opponent's piece display is block
                // or where current player's newPlayerSpace = opponent's currentSpace
                

                // Need to change turns if property cannot be purchased


                // End turn if don't want to purchase
                $(".endTurn").on("click", function() {
                    if (currentPlayerId === 1) {
                        currentPlayerId = 2;
                    } else {
                        currentPlayerId = 1;
                    }
                })

                // If player decides to buy this property
                $(".buyBtn").on("click", function(event) {
                    let id = $(this).data("id");
                    
                    $.ajax("/api/property/" + id, {
                        type: "GET"
                    }).then(function(propertyResults) {
                        let price = propertyResults.price;
            
                        // Subtract property price from player's money
                        let newMoney = playerMoney - price
                        
                        // Update player's money
                        $.ajax({
                            type: "PUT",
                            data: {money: newMoney},
                            url: "/api/players/" + currentPlayerId
                        }).then(function() {
                            // Update property's owned state and foreignKey
                            $.ajax({
                                type: "PUT",
                                data: {owned: true, PlayerId: currentPlayerId},
                                url: "/api/property/" + id
                            }).then(function() {
                                //Buy button disappear for this property
                                let buyButtons = document.getElementsByClassName("buyBtn");
                                for (let i=0; i<buyButtons.length; i++) {
                                    if (buyButtons[i].dataset.id == newPlayerSpace) {
                                        buyButtons[i].style.display = "none";
                                    }
                                }
                                // Update player turn
                                if (currentPlayerId === 1) {
                                    currentPlayerId = 2;
                                } else {
                                    currentPlayerId = 1;
                                }
                            });
                        })  
                    })
                })

            });
        })

    })

})