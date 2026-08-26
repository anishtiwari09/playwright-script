let a = 10
let b = 20
let temp = a
a = b
b = temp
console.log(a,b)

// without using temp variable

let c = 10
let d = 20
let e = c + d

c = e - c
d = e - d
console.log(c, d)

//String length

let str = "Deepak"
console.log(str[str.length - 1])

//Strings are immutable & to convert string we use methods

let message = " Hello Deepak "
console.log(message.toUpperCase())
console.log(message.trim().toUpperCase()) //Chain multiple method
console.log(message.indexOf("Deepak")) // it tells where in a str a given str occurs.
console.log(message.slice(2)) // it slice an existing string and it gives you a pice of it leaving the original str unchanged
console.log(message.replace("Deepak", "Patel")) //replace what? with replace value

let firstName = "Deepak"
let lastName = "Patel"
let fullName = {firstName, lastName}  //{} are used to concatinate the str with descriptive manner
console.log(fullName)

//Data type

//1. Boolean

let isLoggedin = true  // boolean 

//variable can change their types - Dynamic typing.
let numDonuts = 12
numDonuts = false
numDonuts = "Hello"
console.log(numDonuts)

/*2. String
    1. String cabe defined with "", 
    2. '' 
    3. `` (backticke)

    if did not declare the str inside the qoute it will be treated as variable and it is not allowed in str
*/
let animal = "Tiger"  // it should be consistency to define string
let veggies = 'Beans'
let fruites = `Apple`
console.log({animal, veggies, fruites})

// we can use qoute inside qoute

let name = "`Deepak`" //allowed
let sirName = ''patel'' // not allowed.

let employee = "Deepak"
let id = 100
let empName = employee + id  // automatic type conversion or coerction. it will convert number into str in this example
console.log(empName)

//String are indexed
// D E E P A K
// 0 1 2 3 4 5

let stuName = "Deepak"
let branch = "MCA"
let stuDeparment = stuName + branch
console.log(stuDeparment)
console.log(stuDeparment.length) // give the length of the char
console.log(stuDeparment.length-1) //
console.log(stuDeparment[stuDeparment.length-1]) // give the last char of the string

//String bultin methods
//Syntax: string.someMethods()

let message1 = "Hey there"
let message2 = message1.toUpperCase()
let message3 = message1.toLowerCase()
console.log(message2)
console.log(message3.toLowerCase())

let greeting = '  Good Morning  '
let newGreeting = greeting.trim()  // trim the begining and ending of the spaces
console.log(newGreeting)

//Method chaning

let color = "   Black  "
console.log(color.trim().toUpperCase())

//includes() & indexOf()

let movie = "Toxic"
console.log(movie.includes('a')) // indicate the yes or no
console.log(movie.indexOf('x')) // indicates where it is present.

//Slice: give me the string from the index (0,1,2,3..)

let str1 = "This is a super long string"
console.log(str1.slice(7))
console.log(str1.slice(4, 10)) //start to end index

let Player = "Footbal"
console.log(Player.slice(-2)) // gives last 2 char of string

//replace. syntax : replacewhat, replace with. it will replace only the first occurence

let sports = "Cricket is a famous play in India"
console.log(sports.replace('India', 'Australia'))

//replace all. replace everything

let famousPlayer = "Sachin is a faoums cricket player in India"
console.log(famousPlayer.replaceAll('Sachin', 'Virat'))

//Split: it split the string. Use split when you want to brak a string into pices and work with individually

let text = "Hello Patel"
console.log(text.split(" "))

let crickter = "Virat, Sachin, Dhoni, Rahul"
console.log(crickter.split(","))

let name1 = "Javascript"
console.log(name1.split("")) //spliting empty string

let park = "Yellostone"
const index = park.indexOf('Stone')
console.log(index)  // o/p will be -1 since JS is a case sensitive

let yell = 'GO AWAY!!'
console.log(yell.indexOf('!')) //o/p will be 7 because of first occurence

console.log('GARBAGE!'.slice(2).replace("B", "")) //Method chaining

//string escape charachter

console.log("Deepak'\nPatel")

//String template literals are used to concatinate: it should be written inside the backticks (`) with ${}

let firstName1 = "Deepak"
let lastName2 = "Patel"
let user = `New user is ${firstName1} ${lastName2}`
console.log(user)

//Math Utility object

console.log(Math.PI)

let num2 = 4.976363
console.log(Math.round(num2))

let num3 = 19
console.log(Math.pow(25, 3))

//Math.random() generate a fractional number

console.log(Math.floor(Math.random() * 10)) + 1
/* generate random number b/w 0 & 9. 
random will generate 0.19887 hence multi with 10 hence it becomes 1.8787 and we did floor to remove fraction
 adding +1 at the end to make random num b/w 1 and 10
 */

//Comparision operators
/*
> grater than
< lessthan

== loose equality
!= loose not equality
=== tiriple equal or strict equality
!== strictly not eaulity
*/

// == & ===

//loose equality == it will check equality of type not vale

console.log(4 == '4') // o/p will be true since it comapre the value & internaly JS converting 4 into str not type and never use this in code.

console.log(4 === '4') // o/p will be false since here it match type and value

console.log(10 != '10') // o/p flase since we are using loose not equal
console.log(10 !== '10') // o/p true always use this in code

//Truthy and falsy value

/*

Everything is truthy except for below 6
1. false
2. 0
3. ""
4. null
5. undefined
6. NaN
*/

let mestry = 0
if(mestry){console.log('truthy')

}

else {console.log('falsy')

}

//logical operator
/*
AND -&& : Both side needs to be true
OR - || : Any one should be true
NOR - !
*/

console.log(1 < 4 && 'a' === 'a') // true & true -> true
console.log(9 >10 && 9 >= 9) // false & true -> false, false & false -> true
console.log(9 > 10 || 9 > 9) //true since any one should be true
console.log(10 !== 10)
console.log(!(0 === 0)) //false

// operator precidence (priority)
//BODMAS

let x = 7
console.log(x == 7 || (x === 3 && x > 30))

//short circuting in JS

x = 7

console.log(x === 3 && x > 30) // since the right hand side is false no need to excute the LHS called short circuting
console.log(x > 9 || x === 3) // 

// Ternory operator
// unory operator counter++
// binory operator a + b

let num = 2
//if (num === 7){console.log('Lucky')} else{console.log('bad')}

num ===7 ? console.log('lucky') : console.log('bad') //ternory operator converty multiple LOC into single line & can be used only when we have single if condition.

// We can use ternary operator to assign value to a variable

let status1 = 'online'
let color

status1 === 'offline' ? color = 'red' : color = 'green'
console.log(color)




