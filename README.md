## JapanMap Non-Fungible Token (ERC721) Generic Implementation

This repository is JapanMap ERC721 dApps.
You can get Japanese prefecture by ether.

I use following source => https://takemaru-hirai.github.io/japan-map/
This demo site => http://japanmap.wakuwaku-currency.com

I use truffle for deployment, testing, and development, and use [Typescript](https://www.typescriptlang.org/) for testing and deployment.

### Setup
---------------
##### Dependencies

Install dependencies:
```
npm install
```

##### Testing

Start `testrpc`:
```
npm run testrpc
```
Run `truffle` migrations:
```
npm run migrate
```
Run `truffle` tests:
```
npm test
```

### Deploy dev server
---------------
#### MetaMask Settting

Change MetaMask network form XXX to localhost:8545

#### change test account private key

1. check test account private key
 [---] -> Export Private key -> copy private key
2. change "testrpc-local" command account private key in package.json for you need.
 ex "testrpc-local": ・・・ --account='PRIVATEKEY_1, 10000000000000000000'  --account='PRIVATEKEY_2, 10000000000000000000'",

#### run testrpc-local

```
npm run testrpc-local
```

#### migrate

Run `truffle` migrations:
```
npm run migrate
```

#### Build

* This "how to build" is written for UNIX

Set Environment Variable.

```
export BASE_URL=http://localhost:8080
export CONTRACT_ADDR=0xb367099f07630e4977b50ff5318212d6abb40953
```

- BASE_URL is your node url.
- CONTRACT_ADDR is your contract address. You can find this in migrate output log

Execute script

```
./scripts/create_dist.sh
```

#### Create init data

```
# npm run console
```
And input following command on console
```
myToken = PrefectureToken.at(PrefectureToken.address)

myToken.mint(1,"hokkaido",1);
myToken.mint(2,"aomori",1);
myToken.mint(3,"iwate",1);
myToken.mint(4,"miyagi",1);
myToken.mint(5,"akita",1);
myToken.mint(6,"yamagata",1);
myToken.mint(7,"fukushima",1);
myToken.mint(8,"ibaraki",1);
myToken.mint(9,"tochigi",1);
myToken.mint(10,"gumma",1);
myToken.mint(11,"saitama",1);
myToken.mint(12,"chiba",1);
myToken.mint(13,"tokyo",1);
myToken.mint(14,"kanagawa",1);
myToken.mint(15,"niigata",1);
myToken.mint(16,"toyama",1);
myToken.mint(17,"ishikawa",1);
myToken.mint(18,"fukui",1);
myToken.mint(19,"yamanashi",1);
myToken.mint(20,"nagano",1);
myToken.mint(21,"gifu",1);
myToken.mint(22,"shizuoka",1);
myToken.mint(23,"aichi",1);
myToken.mint(24,"mie",1);
myToken.mint(25,"shiga",1);
myToken.mint(26,"kyoto",1);
myToken.mint(27,"osaka",1);
myToken.mint(28,"hyogo",1);
myToken.mint(29,"nara",1);
myToken.mint(30,"wakayama",1);
myToken.mint(31,"tottori",1);
myToken.mint(32,"shimane",1);
myToken.mint(33,"okayama",1);
myToken.mint(34,"hiroshima",1);
myToken.mint(35,"yamaguchi",1);
myToken.mint(36,"tokushima",1);
myToken.mint(37,"kagawa",1);
myToken.mint(38,"ehime",1);
myToken.mint(39,"kochi",1);
myToken.mint(40,"fukuoka",1);
myToken.mint(41,"saga",1);
myToken.mint(42,"nagasaki",1);
myToken.mint(43,"kumamoto",1);
myToken.mint(44,"oita",1);
myToken.mint(45,"miyazaki",1);
myToken.mint(46,"kagoshima",1);
myToken.mint(47,"okinawa",1);
```

#### Run server

Set Environment Variable.

```
export ETH_MNEMONIC=XXXXX
export INFURA_ACCESS_TOKEN=XXXXX
```

- ETH_MNEMONIC is Ethereum wallet mnemonic. You get MNEMONIC when you install MetaMask
- INFURA_ACCESS_TOKEN is infura access token. see -> https://infura.io/

* MetaMask -> https://metamask.io/

```
# npm run server
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://192.168.16.2:8080
```

#### Access local site by autoOpenBrowser

http://127.0.0.1:8080

### other

#### migrate ropsten

```
npm run migrate-ropsten
```

#### console ropsten

```
npm run console-ropsten
```
