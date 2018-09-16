#!/usr/bin/env node

coins = ['bitcoin','bitcoin-testnet','ethereum']

const [,, ... args] = process.argv
console.log("Hello World " + args);


function print_words(){
    mnemo = create_mnemonic()
    console.log(mnemo[0])
}

function print_seed(){
    mnemo = create_mnemonic()
    console.log(mnemo[1].toString('hex'))
}

function print_mnemonic(){
    mnemo = create_mnemonic()
    console.log("Your 24 mnemonic words are: \n" + mnemo[0] + "\n")
    console.log("The equivalent master seed is: \n" + mnemo[1].toString('hex') + "\n")
}

function get_privatekey(data){
    return data[0].toString('hex')
}

function get_address(data){
    return data[1]

}

function print_accountfromseed(words,network,account_number){

    if(!coins.includes(network)){
        throw "Wrong Network : should be ethereum or bitcoin or bitcoin-testnet!"
    }
    data = account_from_seed(seed,accoun_number,network)
    if(network === "bitcoin"){
        console.log("private key : " + data[0].hex() + "\n")
        console.log("WIF : " + data[2] + "\n")
        console.log("public key : " + data[3].hex() + "\n")
        console.log("address : " + data[1] + "\n")
    }
    else if(network === "bitcoin-testnet"){
        console.log("private key : " + data[0].hex() + "\n")
        console.log("WIF : " + data[2] + "\n")
        console.log("public key : " + data[3].hex() + "\n")
        console.log("address : " + data[1] + "\n")
    }
    else if(network === "ethereum"){
        console.log("private key : " + data[0].hex() + "\n")
        console.log("address : " + data[1] + "\n")                        
    }
}

function print_accountfromseed(words,network,account_number){
    seed = create_seed(words)
    print_accountfromseed(words,network,account_number)
}

function print_privatekey(seed,network,account_number){

    if(!coins.includes(network)){
        throw "Wrong Network : should be ethereum or bitcoin or bitcoin-testnet!"
    }
    data = account_from_seed(seed,accoun_number,network)
    console.log(get_privatekey(data).toString('hex'))
}

function print_address(seed,network,account_number){

    if(!coins.includes(network)){
        throw "Wrong Network : should be ethereum or bitcoin or bitcoin-testnet!"
    }
    data = account_from_seed(seed,accoun_number,network)
    console.log(get_address(data).toString('hex'))
}
