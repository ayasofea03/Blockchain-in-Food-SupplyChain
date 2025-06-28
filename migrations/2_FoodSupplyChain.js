const FoodSupplyChain = artifacts.require("FoodSupplyChain");

module.exports = function (deployer) {
  deployer.deploy(FoodSupplyChain);
};
