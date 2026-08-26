//Apply function to collection of data
//fgarEach()
//map()
//filter()
//sort()
//reduce()

const { title } = require("node:process")

//forEach(): 1. accept a callback func 2. calls the callback once per ele in the array 3. no need of return 4. n reference to eacj ele.

const nums = [1,2,31,34,4,21,10]
nums.forEach(function dummy(num){ //this entire part is callback func.
    console.log(num)

})

//arrow func

const number = [23,12,43,32,21,22,89]
number.forEach(num1 =>{
    console.log(num1)
})

//Complex arrey

const books=[
    {
        title: "Need you",
        author: 'Deepak',
        rating: 4.4
    },

     {
        title: "One Day",
        author: 'Patel',
        rating: 4.2
    },
      {
        title: "Fallow Me",
        author: 'Ishanvi',
        rating: 4.5
    },
]

books.forEach((book, index) =>{
    console.log(book.author, index)
})

//map() function: It is used to create the new array of same length from the exixting array by applying logic On each ele of the array
//It doesn't alter original array
//Use the return keyword inside the callback

const texts = ['Hi', 'bye', 'good bye', 'see you soon']
const upper = texts.map(text =>{
    return text.toUpperCase().split("").join(".")
})
console.log(upper)

//Function exp using arrow

const squre = (x) =>{
    return x * x;
}
console.log(squre(4))

const sum = (x, y) => {
    return x + y;
}
console.log(sum(4, 8))

//Implicite return or automatic return or returning somthing without using return keyword.
// //There should be exactly 1 line of code inside callback

const squre1 = x => x * x
console.log(squre1(2))

const digits = [1,2,3,4,5,6,7,8,9]
const digi = digits.map( n1 => 
n1 % 2 === 0 ?  'even' : 'odd'

)
console.log(digi)

// filter method 
// Accept a callback function. Create a new arry with all the ele that pass
//the test provided by the implimentation function/condition 
//use the return keyword inside the callback

const digits1 = [1,2,3,4,5,6,7,8,9]
const evens = digits1.filter(num => {
    return num % 2 === 0
})
console.log(evens)

const books1=[
    {
        title: "Need you",
        author: 'Deepak',
        rating: 4.4
    },

     {
        title: "One Day",
        author: 'Patel',
        rating: 4.2
    },
      {
        title: "Fallow Me",
        author: 'Ishanvi',
        rating: 4.5
    },
]
console.log(books1.filter(book => book.rating >=4.5))

//Revisitng sort()
//it works fine for string but not for numbers
//We can modify the behaviour of sort() method to sort number by providing a compare func
//arr.sort(compareFunc(a, b))
//if comapreFunc(a, b) returns less than 0 sort a before b
//if comapreFunc(a, b) returns grater than 0 sort b before a


const price =[100, 200, 400, 40, 700]
const asecSort = console.log(price.slice().sort((a, b) => a - b))
const decSort = console.log(price.slice().sort((a, b) => b - a))
console.log(price, asecSort, decSort)

//reduce(callbackFun, initialValue)
const num3 = [3, 2, 4, 6, 8, 9]
const sum3 = num3.reduce((x, y) => {
    return x * y
})
console.log(sum3)