//

const { rejects } = require("node:assert");
const { error } = require("node:console");
const { resolve } = require("node:dns");

//below is the syncronus it will print or execute line by line.
console.log("Start")
console.log("Processing")
console.log("End")

console.log("Start")

function fetchData(){
    let start = Date.now();
    while(Date.now() - start < 3000){}
    return "Data loaded";
}

let data = fetchData();
console.log(data);
console.log('end');

//Async code
//How does JS handles Async
//1. Callback 2. Promises 3. Await
console.log("Start");

setTimeout(() => {
    console.log("Async task finished!");

}, 2000);
console.log('end')

console.log("Start");
setTimeout(() => {
    console.log("Step1")
    setTimeout(() => {
        console.log("Step2")
        setTimeout(() => {
            console.log("Step3")
        }, 1000)
    }, 1000)
}, 1000)
console.log("end")

//Promises: 

function delay (message,  time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(message)
            resolve() //call resolve when taks is done

        }, time)
    })
}

console.log("Start")
delay("Step1", 1000)
.then(() => delay("Step2"), 1000)
.then(() => delay("Step3"), 1000)
.then(() => delay("Step4"), 1000)
.then(() => delay("All steps are done"))
console.log()

//Reject example
function delay2 (messgae, time, shouldFail = false){
    return new Promise((resolve, rejects) => {
        setTimeout(() => {
            if (shouldFail){
                rejects("Error: something went wrong")
            }
            else{
                console.log(messgae)    
                resolve()
            }

        }, time)
    })
}

console.log("Start")
delay2("Step1", 1000)
.then(() => delay2("Step2", 1000, true))
.then(() => delay2("Step3", 1000))
.catch((error) => console.error(error))

console.log("end")

//async await

function delay(message, time, shouldFail = false){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail){
                reject("Error")
            }
            else
            {
                console.log(message) 
                resolve()
            }
        }, time)
    })
}

async function runTasks() {
    console.log("start")

    try{

        await delay("Step1", 1000)
        await delay("Step2", 1000, true)
        await delay("Step3", 1000)
    } catch (error){
        console.error(error)
    }
    console.log("end")
}
runTasks()