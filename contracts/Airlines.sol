pragma solidity ^0.4.4;

contract Airlines {
    address[16] public customers;

    function book(uint airlineId) public returns (uint) {
      require(airlineId >= 0 && airlineId <= 15);

      customers[airlineId] = msg.sender;

      return airlineId;
    }
    function getCustomers() public view returns (address[16]) {
      return customers;
    }
}
