$(function() {
    $(".diceBtn").on("click", function(event) {
        // Produce random number

        // Update player's currentSpace

        // Add current property's data-id, data-price, and data-owned to buy button so we can use them later

    })

    $(".buyBtn").on("click", function(event) {
        // Get current player's ID and money ?
        let playerid = 1;
        let playerMoney = 1500;

        // Get player's currentSpace and property info
        let id = $(this).data("id");
        let price = $(this).data("price");
        let owned = $(this).data("owned");

        if (owned===true) {
            alert("This property is already owned!");
        } else {
            // Update owned state
            let newOwned = {
                owned: true
            };

            // Player's id as property's new foreignKey
            let newForeignKey = {
                foreignKey: 1
            }

            // Subtract property price from player's money
            let newMoney = {
                money: playerMoney - price
            };
            
            // Update player's money
            $.ajax("/api/players/" + playerid, {
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