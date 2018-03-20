App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load airliness.
    $.getJSON('../airplanes.json', function(data) {
      var airlinesRow = $('#airlinesRow');
      var airlinesTemplate = $('#airlinesTemplate');

      for (i = 0; i < data.length; i ++) {
        airlinesTemplate.find('.panel-title').text(data[i].name);
        airlinesTemplate.find('img').attr('src', data[i].picture);
        airlinesTemplate.find('.airline-seatsAvailable').text(data[i].seatsAvailable);
        airlinesTemplate.find('.airline-rate').text(data[i].rate);
        airlinesTemplate.find('.airline-depart').text(data[i].Departure);
        airlinesTemplate.find('.btn-air').attr('data-id', data[i].id);

        airlinesRow.append(airlinesTemplate.html());
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
    $.getJSON('Airlines.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var AirArtifact = data;
  App.contracts.Airlines = TruffleContract(AirArtifact);

  // Set the provider for our contract
  App.contracts.Airlines.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted airliness
  return App.markBooked();
});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-air', App.handleAir);
  },
  handleAir: function() {
   event.preventDefault();

   var airlinesId = parseInt($(event.target).data('id'));

   var airInstance;
   // disable button during process
    var text = prompt("No of seats to be booked?", "0");
   $(this).text('Processing..').attr('disabled', true);
  // alert(airlinesId.seatsAvailable);
     alert("Seats Have been booked");
$(this).text('Success').attr('disabled', true);



   // get all accounts of current user
   web3.eth.getAccounts(function(error, accounts) {
       if (error){
           console.error(error);
       }

       // get first (base) account
       var account = accounts[0];

       App.contracts.Airlines.deployed().then(function(instance) {
         airInstance = instance;

         return airInstance.book(airlinesId, {from: account});
       }).then(function(result) {
         return App.markBooked();
       }).catch(function(err) {
         console.log(err.message);
       });
     });
   },
  markBooked: function(customers, account) {
    var airInstance;

App.contracts.Airlines.deployed().then(function(instance) {
  airInstance = instance;

  return airInstance.getCustomers.call();
}).then(function(customers) {
  for (i = 0; i < customers.length; i++) {
    if (customers[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-pet').eq(i).find('bt-air').text('Success').attr('disabled', true);
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
