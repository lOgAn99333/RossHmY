// 代码生成时间: 2025-10-05 21:11:54
// Importing necessary Backbone components
const Backbone = require('backbone');

// Define the Model for storing probability distribution data
const ProbabilityDistributionModel = Backbone.Model.extend({
    defaults: {
        events: [],
        total: 0
    },
    
    // Method to add an event to the distribution
    addEvent: function(event) {
        this.get('events').push(event);
        this.set('total', this.get('total') + 1);
        this.trigger('change');
    },
    
    // Method to calculate the probability of a given event
    calculateProbability: function(event) {
        const events = this.get('events');
        const total = this.get('total');
        if (total === 0) {
            throw new Error('No events to calculate probability.');
        }
        const index = events.indexOf(event);
        if (index === -1) {
            throw new Error('Event not found in distribution.');
        }
        return events[index] / total;
    }
});

// Define the Collection to manage multiple ProbabilityDistributionModels
const ProbabilityDistributions = Backbone.Collection.extend({
    model: ProbabilityDistributionModel
});

// Define a View to interact with the user and display results
const ProbabilityDistributionView = Backbone.View.extend({
    el: '#probability-distribution-calculator',
    events: {
        'click #add-event': 'addEvent',
        'click #calculate-probability': 'calculateProbability'
    },
    initialize: function() {
        this.collection = new ProbabilityDistributions();
    },
    
    // Handler for adding an event
    addEvent: function() {
        const event = this.$('#event-input').val();
        if (event) {
            this.collection.add(new ProbabilityDistributionModel({ events: [event] }));
            this.render();
        } else {
            alert('Please enter an event.');
        }
    },
    
    // Handler for calculating the probability
    calculateProbability: function() {
        const event = this.$('#event-input').val();
        try {
            const probability = this.collection.models[0].calculateProbability(event);
            alert(`The probability of the event 