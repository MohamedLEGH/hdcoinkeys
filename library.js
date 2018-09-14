var bip39 = require('bip39')
var HDKey = require('hdkey')

var coininfo = require('coininfo')

var CoinKey = require('coinkey')
var ethUtil = require('ethereumjs-util')
// new Buffer(seed, 'hex')

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
        var hdkey = HDKey.fromMasterSeed(seed,testnet);
    }
    else {
        console.log("error : wrong network" + network);
        throw "Wrong Network : should be ethereum or bitcoin or bitcoin-testnet!";
    }
    return hdkey
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
    return account.privateKey
}

function ethereum_priv_to_addr(p){
    const pubKey = ethUtil.privateToPublic(p);
    const addr = ethUtil.publicToAddress(pubKey).toString('hex');
    const address = ethUtil.toChecksumAddress(addr);
    return address
}

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
var t = rootkey_from_seed(testS,network='bitcoin')
var pr = account_from_rootkey(t,account_number=0,network='bitcoin')
//var addr = ethereum_priv_to_addr(pr)
var key = new CoinKey(new Buffer.from(pr, 'hex'))

console.log("*********Zero*********")

console.log(key.privateWif)
console.log("*********Zero Address*********")
//console.log(addr)
console.log(key.publicAddress) 
