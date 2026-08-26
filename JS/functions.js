import { resourceLimits } from "node:worker_threads"

/*Function are reuseable procedure. 
 It allow us to write resusable, moduler code
 Syntax:

 function functionName(){
 //do somthing
 }
 */
function message(){  //Function defnition

console.log('Good Morning!!!')

console.log('Good Morning!!!')
}
message() //Function calling

//Argument: anything passing inside the () is a arguments

function greet(nickName){
    console.log( `Hi ${nickName}`)
   
}
greet('Patel')

function squer(num){
    console.log(Math.pow(num, 2))

}
squer(6)
//functions with multiple argument
function multiply(x, y){
    console.log(x * y)
}
multiply(3, 5)

//return statment

function suqre (num){
    return num * num
}
const result = suqre(5)
console.log(result)

//multiple return statment

function isPurple(color){
    if (color === 'Purple'){
        return true;
    }
    else {return false};
}
console.log(isPurple('Purple'))

// advanced functions
//function scope

function helpMe(){
    let mesg = "Help me!!"  //local variable
    console.log(mesg)
}
helpMe()
console.log(mesg) //it will give an error since scope the function is with in the {}

function changeColor(){
  let  name = "Deepak";
    const age = 25
    var color = 'Black'
}
changeColor()

let bird = 'Crow'

function birdWatch(){
    let bird = "parrote"
    console.log(bird);  //OP: 'parrote' because of local variable
 }

birdWatch()
console.log(bird) //OP: "Crow" since it is accesing the globla variable

//Var shouldn't be used to delare since var act as a global variable if we use the var keyword

if(true){
    var animla ='eel'
    console.log(animla)
}
console.log(animla)

//functions expression
//function without a name is annonumous function

const squre1 = function (num){
    return num * num;
}

console.log(squre1(6))

const sum = function (x, y){
    return x + y
}
console.log(sum(5, 5))

//functions as argument. passing one function as to another func as arrgument

function callTwice(func){
    func()
    func()
}
function laugh(){
    console.log("HAHAHAHHAHAHAHHAHH!!")

}
callTwice(laugh)

//setTimeout(callBackfunc, timer): Built in func and it will run a certain block of code after certain amt of time.
//callback func
function grumpus(){
    console.log("This is a line1")
    console.log("This is a line2")
    console.log("This is a line3")
}
setTimeout(grumpus, 3000)