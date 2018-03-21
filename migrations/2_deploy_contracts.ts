const LandBase = artifacts.require("LandBase");
const PrefectureToken = artifacts.require("PrefectureToken");

module.exports = (deployer: any) => {
    deployer.deploy(PrefectureToken, {
        gas: 2000000
    })
};
