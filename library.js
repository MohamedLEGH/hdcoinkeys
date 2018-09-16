var bip39 = require('bip39')
var HDKey = require('hdkey')

var coininfo = require('coininfo')

var CoinKey = require('coinkey')
var ethUtil = require('ethereumjs-util')
// new Buffer(seed, 'hex')

// Following https://iancoleman.io/bip39/

function create_words(){
    return bip39.generateMnemonic(strength=256);
}

function create_seed(words){
    return bip39.mnemonicToSeed(words);
}

function create_mnemonic(){
    words = create_words();
    seed = create_seed(words);
    return [words,seed]
}

function rootkey_from_seed(seed,network){
    if(network === 'bitcoin' || network === 'ethereum'){
        var hdkey = HDKey.fromMasterSeed(seed);
    }
    else if(network === 'bitcoin-testnet'){
        var testnet = coininfo.bitcoin.test.versions.bip32;
        //coininfo('BTC-TEST')
        //coininfo('BTC-TEST')['versions']['bip32']
        var hdkey = HDKey.fromMasterSeed(seed,testnet);
    }
    else {
        console.log("error : wrong network" + network);
        throw "Wrong Network : should be ethereum or bitcoin or bitcoin-testnet!";
    }
    return hdkey
}

function coin_data(C){
    return [C.privateKey,C.publicAddress,C.privateWif,C.publicKey]
}

function bitcoin_data(key){
    C = CoinKey(key)
    return coin_data(C)
}

function bitcointestnet_data(key){
    C = CoinKey(key,coininfo('BTC-TEST'))
    return coin_data(C)
}

function ethereum_account_to_addr(p){
    const pubKey = ethUtil.privateToPublic(p);
    const addr = ethUtil.publicToAddress(pubKey).toString('hex');
    const address = ethUtil.toChecksumAddress(addr);
    return address
}

function ethereum_data(key){
    return [key,ethereum_account_to_addr(key)]
}


function account_from_privatekey(key,network){
    if(network === 'bitcoin'){
        return bitcoin_data(key)
    }
    else if(network === 'bitcoin-testnet'){
        return bitcointestnet_data(key)
    }
    else if(network === 'ethereum'){
        return ethereum_data(key)
    }

}

function account_from_rootkey(key,account_number,network){
    if(network === 'bitcoin'){
        var network_number = 0
    }
    else if(network === 'bitcoin-testnet'){
        var network_number = 1
    }
    else if(network === 'ethereum'){
        var network_number = 60
    }
    else{
        console.log("error : wrong network" + network);
        throw "Wrong Network : should be ethereum or bitcoin or bitcoin-testnet!";
    }
    var net = network_number.toString()
    var index = account_number.toString()
    
    path = `m/44'/${net}'/0'/0/${index}`
    account = key.derive(path)
    return account_from_privatekey(account.privateKey,network)
}

function account_from_seed(seed,nb,network){
    rootK = rootkey_from_seed(seed,network)
    return account_from_rootkey(rootK,nb,network)
}

/*
function bitcoin_fromkey(p){
    return new CoinKey(pr)
}
function bitcointestnet_fromkey(p){
    return new CoinKey(pr,coininfo('BTC-TEST'))
}
*/
/////////////// Test ////////////////

var test = create_words();

console.log(test)

var testS = create_seed(test)

console.log(testS.toString('hex'))
console.log("******************")
/*
var hdkey = HDKey.fromMasterSeed(testS)
console.log(hdkey.privateExtendedKey)
console.log("******************")

console.log(hdkey.publicExtendedKey)

var testnet = coininfo.bitcoin.test.versions.bip32

console.log("********testnet**********")

var hdkey = HDKey.fromMasterSeed(testS,testnet)
console.log(hdkey.privateExtendedKey)
console.log("******************")

console.log(hdkey.publicExtendedKey)



*/
//var t = rootkey_from_seed(testS,network='bitcoin')
//var tp = rootkey_from_seed(testS,network='bitcoin-testnet')
var bitcoin = account_from_seed(testS,0,'bitcoin')
var bitcointest = account_from_seed(testS,0,'bitcoin-testnet')
var ethereum = account_from_seed(testS,0,'ethereum')

//var addr = ethereum_priv_to_addr(pr)
//var bitcoin = bitcoin_fromkey(pr)
//var bitcointest = bitcointestnet_fromkey(prt)
console.log("*********Zero Bitcoin WIF*********")

console.log(bitcoin[2])
console.log("*********Zero Bitcoin Address*********")
console.log(bitcoin[1])

console.log("*********Zero BitcoinTestnet WIF*********")
console.log(bitcointest[2])
console.log("*********Zero BitcoinTestnet Address*********")
console.log(bitcointest[1])

console.log("*********Zero Ethereum PrivateKey*********")
console.log(ethereum[0].toString('hex'))
console.log("*********Zero Ethereum Address*********")
console.log(ethereum[1])

