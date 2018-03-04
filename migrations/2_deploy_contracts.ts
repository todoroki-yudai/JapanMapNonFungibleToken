const LandBase = artifacts.require("LandBase");
const Prefecture = artifacts.require("Prefecture");

module.exports = (deployer: any) => {
    deployer.deploy(Prefecture);
};
