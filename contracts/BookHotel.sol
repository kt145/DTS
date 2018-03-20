pragma solidity ^0.4.17;

contract BookHotel {
  address[16] public customers;
  // Booking a hotel
  function book(uint hotelId) public returns (uint) {
    require(hotelId >= 0 && hotelId <= 15);

    customers[hotelId] = msg.sender;

    return hotelId;
  }
  // Retrieving the adopters
  function getCustomers() public view returns (address[16]) {
    return customers;
  }
}
