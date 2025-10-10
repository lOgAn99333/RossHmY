// 代码生成时间: 2025-10-11 03:07:30
// Define a Backbone model for a Supply Item
var SupplyItem = Backbone.Model.extend({
  defaults: {
    id: '',
    name: '',
    quantity: 0,
    price: 0.0,
    supplierId: ''
  },
  
  validate: function(attrs) {
    if (isNaN(attrs.quantity) || attrs.quantity < 0) {
      return 'Quantity must be a non-negative number.';
    }
    if (isNaN(attrs.price) || attrs.price < 0) {
      return 'Price must be a non-negative number.';
    }
  }
});

// Define a Backbone collection for managing multiple Supply Items
var SupplyItems = Backbone.Collection.extend({
  model: SupplyItem
});

// Define a Backbone View for displaying and interacting with Supply Items
var SupplyItemsView = Backbone.View.extend({
  el: '#supply-items',
  
  events: {
    'click #add-item': 'addItem',
    'click #remove-item': 'removeItem'
  },
  
  initialize: function() {
    this.listenTo(this.collection, 'add', this.addOne);
    this.listenTo(this.collection, 'remove', this.addAll);
  },
  
  render: function() {
    this.$el.empty();
    this.addAll();
  },
  
  addOne: function(item) {
    var itemView = new ItemView({ model: item });
    this.$('#items-list').append(itemView.render().el);
  },
  
  addAll: function() {
    this.collection.each(this.addOne, this);
  },
  
  addItem: function() {
    var itemData = {
      name: $('#new-item-name').val(),
      quantity: $('#new-item-quantity').val(),
      price: $('#new-item-price').val(),
      supplierId: $('#new-item-supplier').val()
    };
    var newItem = new SupplyItem(itemData);
    if (!newItem.set(itemData, { validate: true })) {
      alert(newItem.validationError);
      return;
    }
    this.collection.add(newItem);
  },
  
  removeItem: function() {
    var itemId = $('#remove-item-id').val();
    var itemToRemove = this.collection.get(itemId);
    if (itemToRemove) {
      this.collection.remove(itemToRemove);
    }
  }
});

// Define a Backbone View for individual Supply Items
var ItemView = Backbone.View.extend({
  tagName: 'li',
  
  render: function() {
    this.$el.html('Name: ' + this.model.get('name') + ', Quantity: ' + this.model.get('quantity') + ', Price: ' + this.model.get('price') + ', Supplier: ' + this.model.get('supplierId'));
    return this;
  }
});

// Initialize the application
var items = new SupplyItems();
var itemsView = new SupplyItemsView({ collection: items });

// Starting point for the application
$(function() {
  // Initialize the Backbone Views and start the application
  itemsView.render();
});