// Arrays: Order collection values. Majarity time we store related data in array.

let employee = ['Deepak', 'Kavya', 'Niriksha'] // array of string
let empId = [100, 101, 102] // array of numbers
console.log(employee.length)

//Array is also a index Deepak is index 0, Kavya index 1, Niriksh index 2

let shoppingList = ['Shirt', 'T-shirt', 'G-tee']
shoppingList [3] = 'Shorts' //arrays are mutable and we can add an new array or replace the array
shoppingList [3] = 'Pants'
let result = shoppingList[shoppingList.length - 1]  // last element of an array
console.log(result)

//Array methods
/*
push() :Add one or more element at the end of an array
pop() : remove exactly one element at the end of an array

//Performence wise below 2 are not good.
unshit() : adding somthing on the left side or begining of an array
shift() : removing somthing from the left side
*/

let crickterName = ['Sachin', 'Gangully', 'Dravid', 'Kumble']
crickterName.push('Virat') //push
console.log(crickterName)
crickterName.pop()
console.log(crickterName) //pop
crickterName.unshift('Dhoni') //unshift
console.log(crickterName)
crickterName.shift()  //shift
console.log(crickterName)

//Some more array method

//concat() - Merging 2 or more array making one array.
//includes() - check the element is present or not.
//index()
//join() - Joins all the array element make one string.
//reverse() - reverses an array
//slice - create copy of an array
//Splice () - Adding/remvoing/modifiying from the middle
//sort() - sorting array

let fruits = ['Mango', 'Apple']
let vegies = ['Tomato', 'Potato']
let fruitsVeg = fruits.concat(vegies, ['Onion', 'Beans'])// adding additional vegitable to vegies
console.log(fruitsVeg)
console.log(fruitsVeg.includes('Onion')) //includes()

let pets = ['Dog', 'Cat', 'Cow', 'bat']
console.log(pets.includes('at')) // it gives false since we are looking for exact match
console.log(pets.includes('Cat')) // true since exact match
console.log(pets.indexOf('Cat')) // it will return where the element is present.
console.log(pets.reverse()) // it will reverse an array

let elements = ['fire', 'water', 'Air']
//console.log(elements.join())
console.log(elements.join(','))

//Slice()

let animal = ['Elepahnt', 'Tiger', 'Monkey']
//console.log(animal.slice(1)) // slice a index from 1 index onwards
console.log(animal.slice(0,2)) // here the 1st index is inclusive and & 2nd is exclusive. This can be used when we need middle of an array.

//Splice () adding, removeing from the middle of the array.

let animals = ['shark', 'zeebra', 'lion', 'deer', 'gorila', 'donkey', 'cow']
// splice (starting index, delete count, item to insert). Anyting we need to add at begining or end we use push & pop.
//animals.splice(1, 0, 'octopus') // to add an additional array element
//console.log(animals)

// at index 5 delete 2 items.

/*animals.splice(5, 2)
console.log(animals)*/
// At index 3 delete 2 items  and replace with "orca" & "grizzly"
animals.splice(3, 2, 'orca', 'grizzly')
console.log(animals)

/*Sort(): Work fine for string in JS hgowever, for numbers it showuld not work since it convert num into string and sort.
to sort numbers we need to use the call back functions.
*/

let month = ['Jan', 'Feb', 'March', 'April', 'June']
month.sort()
console.log(month)

let num = [100, 1, 10, 4, 5, 988]
num.sort()
console.log(num)

//Intorduction to refrence types (pointers)

let fruit = "orange"
let color = fruit
console.log(color === fruit) // o/p will be true since its compairing the value not the memory location.
fruit = "watermelon"
console.log(color === fruit) //o/p will ve false since the color is still a orange

const array = [1, 2, 3, 4]
//const array1 = [1, 2, 3, 4]
const array1 = array //make a second pointer to the same array.

console.log(array === array1) //o/p will be false since for array it comapre the reference type other way its compare the memory location
// we are comparing memory location.

// Explicit type convertion or type casting. it will be usefull when we are extracting any data from table using playwright.

let num1 = '1234'
console.log(typeof Number(num1)) // it convert string to a number

let n = 10
console.log(typeof String(n))

//Automatic type conversion/coercian. JS will automatically convert the type.
console.log("5" + 2) // o.p 52 converting 2 to string
console.log("5" -2) //3 converting str 5 to number




