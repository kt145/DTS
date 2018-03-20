App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load hotels.
    $.getJSON('../hotels.json', function(data) {
      var hotelsRow = $('#hotelsRow');
      var hotelTemplate = $('#hotelsTemplate');

      for (i = 0; i < data.length; i ++) {
        hotelTemplate.find('.panel-title').text(data[i].name);
        hotelTemplate.find('img').attr('src', data[i].picture);
        hotelTemplate.find('.hotel-roomsAvail').text(data[i].roomsAvailable);
        hotelTemplate.find('.hotel-rate').text(data[i].rate);
        hotelTemplate.find('.hotel-location').text(data[i].location);
        hotelTemplate.find('.btn-book').attr('data-id', data[i].id);

        hotelsRow.append(hotelTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
if (typeof web3 !== 'undefined') {
  App.web3Provider = web3.currentProvider;
} else {
  // If no injected web3 instance is detected, fall back to Ganache
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BookHotel.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var BookingArtifact = data;
  App.contracts.BookHotel = TruffleContract(BookingArtifact);

  // Set the provider for our contract
  App.contracts.BookHotel.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted hotels
  return App.markBooked();
});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-book', App.handleBook);
  },
  handleBook: function() {
   event.preventDefault();

   var hotelId = parseInt($(event.target).data('id'));

   var bookingInstance;
   // disable button during process
   $(this).text('Processing..').attr('disabled', true);
   var text = prompt("No of rooms to be booked?", "0");
   $(this).text('Success').attr('disabled', true);
   // get all accounts of current user
   web3.eth.getAccounts(function(error, accounts) {
       if (error){
           console.error(error);
       }

       // get first (base) account
       var account = accounts[0];

       App.contracts.BookHotel.deployed().then(function(instance) {
         bookingInstance = instance;

         return bookingInstance.book(hotelId, {from: account});
       }).then(function(result) {
         return App.markBooked();
       }).catch(function(err) {
         console.log(err.message);
       });
     });
   },
  markBooked: function(customers, account) {
    var bookingInstance;

App.contracts.BookHotel.deployed().then(function(instance) {
  bookingInstance = instance;

  return bookingInstance.getCustomers.call();
}).then(function(customers) {
  for (i = 0; i < customers.length; i++) {
    if (customers[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-pet').eq(i).find('bt-book').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
      console.log(err.message);
  });
}

};

$(function() {
$(window).load(function() {
  App.init();
});
});
