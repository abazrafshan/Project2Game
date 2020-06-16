// Document.ready
$(function() {
    //Indicate turn
    var currentPlayerId = 1;
    $("#turn").html(`<h4>Ready Player ${currentPlayerId}<h4>`);

    $(".diceBtn").off().on("click", function(event) {
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
            let newPlayerSpace = playerSpace += diceTotal;

            // Account for passing GO
            newPlayerSpace = newPlayerSpace>16 ? newPlayerSpace-16 : newPlayerSpace;

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
                // If they weren't already on Go and they passed Go, add property payouts to player's money
                if (playerSpace !== 16 && (newPlayerSpace < playerSpace)) {
                    $.ajax("/api/property", {
                        type: "GET"
                    }).then(function(propertyResults) {
                        for (let i=0; i<propertyResults.length; i++) {
                            if (propertyResults[i].PlayerId === currentPlayerId) {
                                playerMoney = parseInt(playerMoney);
                                playerMoney += parseInt(propertyResults[i].payout);
                            };
                        }
                        //Update player's money
                        $.ajax({
                            type: "PUT",
                            data: {money: playerMoney},
                            url: "/api/players/" + currentPlayerId
                        }).then(function() {
                            //Update money in stats
                            $(`#money${currentPlayerId}`).text(`Money: $${playerMoney}`);
                        })
                    })
                } else if (newPlayerSpace == 16) {
                    $.ajax("/api/property", {
                        type: "GET"
                    }).then(function(propertyResults) {
                        for (let i=0; i<propertyResults.length; i++) {
                            if (propertyResults[i].PlayerId === currentPlayerId) {
                                playerMoney = parseInt(playerMoney);
                                playerMoney += parseInt(propertyResults[i].payout);
                            };
                        }
                        //Update player's money
                        $.ajax({
                            type: "PUT",
                            data: {money: playerMoney},
                            url: "/api/players/" + currentPlayerId
                        }).then(function() {
                            //Update money in stats
                            $(`#money${currentPlayerId}`).text(`Money: $${playerMoney}`);
                            
                            $(".endTurn").trigger("click");                           
                        })
                    })
                }

                // Pickpocketing if player lands on property opponent is on
                // Need to change turns if property cannot be purchased
                let buyButtons = document.getElementsByClassName("buyBtn");
                let opponentId = currentPlayerId === 1 ? 2 : 1;
                let opponentPieces = document.getElementsByClassName(`p${opponentId}`);
                for (let i=0; i<buyButtons.length; i++) {
                    if (opponentPieces[i].dataset.id == newPlayerSpace && opponentPieces[i].style.display == "block") {
                        console.log(currentPlayerId);
                        pickpocket()
                        if (buyButtons[i].dataset.id == newPlayerSpace && buyButtons[i].style.display == "none") {
                            console.log("end turn");
                            $(".endTurn").trigger("click");
                        }  
                    }
                    else if (buyButtons[i].dataset.id == newPlayerSpace && buyButtons[i].style.display == "none") {
                        $(".endTurn").trigger("click");
                    }
                }

                // End turn if don't want to purchase
                $(".endTurn").off().on("click", function() {
                    if (currentPlayerId === 1) {
                        currentPlayerId = 2;
                    } else {
                        currentPlayerId = 1;
                    }
                    $("#turn").html(`<h4>Ready Player ${currentPlayerId}<h4>`);
                })

                // If player decides to buy this property
                $(".buyBtn").off().on("click", function(event) {
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
                                for (let i=0; i<buyButtons.length; i++) {
                                    if (buyButtons[i].dataset.id == newPlayerSpace) {
                                        buyButtons[i].style.display = "none";
                                    }
                                }
                                // Get properties and count number owned by player
                                $.ajax("/api/property", {
                                    type: "GET"
                                }).then(function(propResults) {
                                    let count = 0;
                                    for (let i=0; i<propResults.length; i++) {
                                        if (propResults[i].PlayerId == currentPlayerId) {
                                            count += 1;
                                        }
                                    }

                                    //Change card border color to match owner piece
                                    let cards = document.getElementsByClassName("card");
                                    for (let i=0; i<cards.length; i++) {
                                        if (cards[i].getAttribute("data-id") == id) {
                                            cards[i].style.border = `2px solid ${currentPlayerId == 1 ? "red" : "blue"}`;
                                        }
                                    }

                                    //Display updated money and number of props in stats
                                    $(`#money${currentPlayerId}`).text(`Money: $${newMoney}`);
                                    $(`#prop${currentPlayerId}`).text(`Number of Properties: ${count}`);

                                    // Update player turn
                                    if (currentPlayerId === 1) {
                                        currentPlayerId = 2;
                                    } else {
                                        currentPlayerId = 1;
                                    }
                                    $("#turn").html(`<h4>Ready Player ${currentPlayerId}<h4>`);
                                    
                                    // End game if all properties sold
                                    let endCount = 0;
                                    for (let i=0; i<buyButtons.length; i++) {
                                        if (buyButtons[i].style.display == "none") {
                                            endCount += 1;
                                        }
                                    }
                                    if (endCount == 15) {
                                        endGame();
                                    }
                                })
                            });
                        })  
                    })
                })
            });
        })

        //Pickpocket
        function pickpocket() {
            currentPlayerId = currentPlayerId === 1 ? 2 : 1;
            $.ajax("/api/players/" + currentPlayerId, {
                type: "GET"
            }).then(function(playerRes) {
                let playerMoney = parseInt(playerRes.money);
    
                let opponentId = currentPlayerId === 1 ? 2 : 1;
                console.log(`${currentPlayerId} pickpocketed ${opponentId}!`);
        
                //Get request for opponent's money
                $.ajax("/api/players/" + opponentId, {
                    type: "GET",
                }).then(function(opponentResults) {
                    let oppMoney = parseInt(opponentResults.money);
                    
                    let stolenAmt = Math.floor(oppMoney/10);
                    oppMoney -= parseInt(stolenAmt);
                    playerMoney += parseInt(stolenAmt);
                        
                    //Update opponent's money
                    $.ajax({
                        type: "PUT",
                        data: {money: oppMoney},
                        url: "/api/players/" + opponentId
                    })
                    //Update player's money
                    $.ajax({
                        type: "PUT",
                        data: {money: playerMoney},
                        url: "/api/players/" + currentPlayerId
                    })
        
                    //Update money in stats
                    $(`#money${opponentId}`).text(`Money: $${oppMoney}`);
                    $(`#money${currentPlayerId}`).text(`Money: $${playerMoney}`);
                })
            })
        }
    })

    //End game
    function endGame() {
        //Get property and player info
        $.ajax("/api/property", {
            type: "GET"
        }).then(function(propertyResults) {
            let money1 = 0;
            let money2 = 0;

            for (let i=0; i<propertyResults.length; i++) {
                if (propertyResults[i].PlayerId == 1) {
                    money1 += parseInt(propertyResults[i].price);
                } else if (propertyResults[i].PlayerId == 2) {
                    money2 += parseInt(propertyResults[i].price);
                }
            }

            $.ajax("/api/players", {
                type: "GET"
            }).then(function(playerResults) {
                money1 += parseInt(playerResults[0].money);
                money2 += parseInt(playerResults[1].money);

                //Determine winner
                if (money1 > money2) {
                    status1 = "WIN";
                    status2 = "LOSS";
                } else if (money1 == money2) {
                    status1 = "TIE";
                    status2 = "TIE";
                } else {
                    status1 = "LOSS";
                    status2 = "WIN";
                }

                //Show final net worth for both players
                $(`#money1`).text(`Net Worth: $${money1}`);
                $(`#money2`).text(`Net Worth: $${money2}`);
                $(`#prop1`).text(`Result: ${status1}`);
                $(`#prop2`).text(`Result: ${status2}`);

                //Yellow border around winner stats
                if (status1=="WIN") {
                    $("#p1").attr("style", "border: 2px solid yellow;");
                } else if (status2=="WIN") {
                    $("#p2").attr("style", "border 2px solid yellow;");
                }

                //Display winner and play again button
                $("#turn").html(`<h4>${status1=="WIN" ? "Player 1 Wins!" : status2=="WIN" ?  "Player 2 Wins!" : "TIE"}</h4>`);
                $(".endTurn").text("Play Again");
                $(".endTurn").addClass("endBtn");
                $(".endBtn").removeClass("endTurn");

                //Button to play again
                $(".endBtn").on("click", function(event) {
                    location.reload();
                });
            })

        })

    }


})
               