pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BookHotel.sol";

contract Test{
  BookHotel booking = BookHotel(DeployedAddresses.BookHotel());

// Testing the book() function
function testUserCanBookHotel() public {
  uint returnedId = booking.book(8);

  uint expected = 8;

  Assert.equal(returnedId, expected, "Booking of Hotel ID 8 should be recorded.");
}
// Testing retrieval of a single pet's owner
function testGetCustomerAddressByHotelId() public {
  // Expected owner is this contract
  address expected = this;

  address customer = booking.customer(8);

  Assert.equal(customer, expected, "Customer of Hotel ID 8 should be recorded.");
}
// Testing retrieval of all pet owners
function testGetCustomerAddressByHotelIdInArray() public {
  // Expected owner is this contract
  address expected = this;

  // Store customers in memory rather than contract's storage
  address[16] memory customers = booking.getCustomers();

  Assert.equal(customers[8], expected, "Customer of Hotel ID 8 should be recorded.");
}
}
