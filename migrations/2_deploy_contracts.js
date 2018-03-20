var Booking = artifacts.require("BookHotel");

module.exports = function(deployer) {
  deployer.deploy(BookHotel);
};

var Airplane = artifacts.require("Airline");

module.exports = function(deployer){
  deployer.deploy(Airplane);
};
