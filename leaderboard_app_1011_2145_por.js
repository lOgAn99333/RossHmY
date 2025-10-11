// 代码生成时间: 2025-10-11 21:45:04
// Define the model for a leaderboard entry
var LeaderboardEntry = Backbone.Model.extend({
    "defaults": {
        "name": "",
        "score": 0
    },
    "initialize": function() {
        // Initialization code (if needed)
    },
    "validate": function(attrs) {
        // Basic validation
        if (!attrs.name) {
            return "Name cannot be empty";
        }
        if (attrs.score < 0) {
            return "Score cannot be negative";
        }
        return null; // No validation error
    }
});

// Define the collection for the leaderboard
var Leaderboard = Backbone.Collection.extend({
    "model": LeaderboardEntry,
    "comparator": function(model) {
        // Sort by score in descending order
        return -model.get("score");
    }
});

// Define the view for the leaderboard
var LeaderboardView = Backbone.View.extend({
    "el": "#leaderboard",
    "events": {
        "submit #addEntryForm": "addEntry",
        "click .deleteEntry": "deleteEntry"
    },
    "initialize": function() {
        this.collection.on("add", this.render, this);
        this.collection.on("remove", this.render, this);
        this.collection.on("reset", this.render, this);
    },
    "render": function() {
        // Clear the leaderboard and re-render entries
        this.$el.empty();
        this.collection.forEach(function(entry) {
            this.$el.append(
                "<li>" + entry.get("name") + ": " + entry.get("score") + " <button class='deleteEntry' data-id='" + entry.cid + "'>Delete</button></li>"
            );
        }, this);
    },
    "addEntry": function(e) {
        e.preventDefault();
        var name = this.$("#name").val();
        var score = parseInt(this.$("#score").val(), 10);
        var newEntry = new LeaderboardEntry({"name": name, "score": score});
        if (!newEntry.set("name", name) || !newEntry.set("score", score)) {
            alert("Invalid input");
            return;
        }
        var error = newEntry.validate();
        if (error) {
            alert(error);
            return;
        }
        this.collection.add(newEntry);
        this.$("#name").val("");
        this.$("#score").val("");
    },
    "deleteEntry": function(e) {
        e.preventDefault();
        var entryId = $(e.currentTarget).data("id");
        var entry = this.collection.get(entryId);
        if (entry) {
            this.collection.remove(entry);
        }
    }
});

// Initialize the application
var leaderboard = new Leaderboard();
var leaderboardView = new LeaderboardView({collection: leaderboard});

// Add some initial entries (if needed)
leaderboard.add([{"name": "Alice", "score": 10}, {"name": "Bob", "score": 20}]);