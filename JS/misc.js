//Default parameter or misilanious JS

function multiply (a, b = 1){ // b = 1 is the default parameter
    return a * b
}
console.log(multiply(3))

// spread operator (...)
const num = [9, 2, 5, 7, 8]
//console.log(Math.max(num)) //we can't access the array value using this.
console.log(Math.max(...num)) // hence we have to use the spread operator
//Usage of spread operator:
// 1. Copy an array with new refrence
//Sorting a num using spread

const price =[100, 200, 400, 40, 700]
const asecSort = console.log([...price].sort((a, b) => a - b))
const decSort = console.log([...price].sort((a, b) => b - a))

//Concatinating the arrays using spread operator

const num1 = [1, 2, 3]
const num2 = [4, 5, 6]
const concat = [...num1, ...num2]
console.log(concat)

// rest parameter (...) contaxt of the code will difine weather its a REST ot Spread
//here in the below code we can pass any number of numbers for addition however if we used sum operator we need to pass only 2 para meter.

function sumAll(...nums){
    let total = 0
    for(const num of nums){
        total = total + num
    }
    return total
}
console.log(sumAll(3, 4))
console.log(sumAll(5, 6, 8))

//reduse using rest parameter

function sumAll1(...nums){
    return nums.reduce((x, y) => {
        return x + y
    })
}
console.log(sumAll1(3, 4))
console.log(sumAll1(5, 6, 8))

//remaining parameter

function fullName(first, last, ...titles){  //..titles is a remaining parameter
    console.log(first)
    console.log(last)
    console.log(titles)
}
fullName("Deepak", "Patel", "QA", "Software", "Testing", "Playwright")

//Destructuring: 1. Array, 2. Object
const raceResult = ['Virat', 'Kohli', 'Patel']
const [gold, ...others] = raceResult
console.log(gold)
console.log(others)

//object
const runner = {
    first: 'Deepak',
    last: 'Patel',
    country: 'India',
    title: 'Winner'
}
//const first = runner.first
//const last = runner.last
//const country = runner.country

const {first, last} = runner
console.log(first)
console.log(last)