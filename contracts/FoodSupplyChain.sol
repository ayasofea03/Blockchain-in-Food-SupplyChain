// SPDX-License-Identifier: MIT\
pragma solidity ^0.8.19;

contract FoodSupplyChain {
    address public owner;

    enum State {
        Harvested,
        Processed,
        Packaged,
        ForSale,
        Sold,
        Delivered
    }

    struct Item {
        uint256 sku;           // Stock Keeping Unit (unique identifier)
        string name;           // Name of the food product
        uint256 harvestTimestamp;
        uint256 price;         // Price in wei
        State state;
        address originFarmer;  // Farmer who harvested the item
        address processor;     // Processor who processed the item
        address packager;      // Packager who packaged the item
        address retailer;      // Retailer selling the item
        address consumer;      // Consumer who bought the item
    }

    uint256 public skuCount;
    mapping(uint256 => Item) public items;

    // Events to emit on state changes
    event Harvested(uint256 sku);
    event Processed(uint256 sku);
    event Packaged(uint256 sku);
    event ForSale(uint256 sku, uint256 price);
    event Sold(uint256 sku, address buyer);
    event Delivered(uint256 sku);

    // Modifiers for restricting access and state transitions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner");
        _;
    }

    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "Caller not authorized");
        _;
    }

    modifier paidEnough(uint256 _price) {
        require(msg.value >= _price, "Insufficient payment");
        _;
    }

    modifier checkValue(uint256 _sku) {
        _;
        uint256 price = items[_sku].price;
        uint256 amountToReturn = msg.value - price;
        payable(msg.sender).transfer(amountToReturn);
    }

    modifier inState(uint256 _sku, State _state) {
        require(items[_sku].state == _state, "Invalid item state");
        _;
    }

    constructo() {
         owner = msg.sender;
         skuCount = 0;
    }

     // 1. Harvest item by farmer
    function harvestItem(string memory _name) public {
        skuCount++;
        items[skuCount] = Item({
            sku: skuCount,
            name: _name,
            harvestTimestamp: block.timestamp,
            price: 0,
            state: State.Harvested,
            originFarmer: msg.sender,
            processor: address(0),
            packager: address(0),
            retailer: address(0),
            consumer: address(0)
        });

        emit Harvested(skuCount);
    }

    // 2. Processor processes the item
    function processItem(uint256 _sku) 
        public
        inState(_sku, State.Harvested)
        verifyCaller(items[_sku].originFarmer)
    {
        items[_sku].state = State.Processed;
        items[_sku].processor = msg.sender;

        emit Processed(_sku);
    }

    // 3. Packager packages the item
    function packageItem(uint256 _sku) 
        public
        inState(_sku, State.Processed)
    {
        items[_sku].state = State.Packaged;
        items[_sku].packager = msg.sender;

        emit Packaged(_sku);
    }

    // 4. Retailer puts item for sale
    function sellItem(uint256 _sku, uint256 _price) 
        public
        inState(_sku, State.Packaged)
    {
        require(_price > 0, "Price must be positive");
        
        items[_sku].state = State.ForSale;
        items[_sku].price = _price;
        items[_sku].retailer = msg.sender;

        emit ForSale(_sku, _price);
    }

    // 5. Consumer buys item
    function buyItem(uint256 _sku) 
        public
        payable
        inState(_sku, State.ForSale)
        paidEnough(items[_sku].price)
        checkValue(_sku)
    {
        items[_sku].consumer = msg.sender;
        items[_sku].state = State.Sold;
        payable(items[_sku].retailer).transfer(items[_sku].price);

        emit Sold(_sku, msg.sender);
    }

    // 6. Consumer confirms delivery
    function confirmDelivery(uint256 _sku) 
        public
        inState(_sku, State.Sold)
        verifyCaller(items[_sku].consumer)
    {
        items[_sku].state = State.Delivered;

        emit Delivered(_sku);
    }

    // Fetch item details
    function fetchItem(uint256 _sku) public view returns (
        uint256 sku,
        string memory name,
        uint256 harvestTimestamp,
        uint256 price,
        State state,
        address originFarmer,
        address processor,
        address packager,
        address retailer,
        address consumer
    ) {
        Item memory item = items[_sku];
        return (
            item.sku,
            item.name,
            item.harvestTimestamp,
            item.price,
            item.state,
            item.originFarmer,
            item.processor,
            item.packager,
            item.retailer,
            item.consumer
        );
    }
}

    
    
        
