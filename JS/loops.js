//Loops is doing somtjing repeteadly
// for, while, for..of, for..in
//forEach() only for arrays
let message = "Hello Deepak"

for(let i = 10; i>1; i--)
{
    console.log(message, i)
}

//For lops & Array
const animals = ['Tiger', 'Lion', 'Elepahnt']
for(let i = 0; i < animals.length; i++) //animals.length is used to make it dynamic insted of num.
{
    console.log(animals[i])
}

//array of objects. Acceing the object from the array of Objects

let student =[
    {
        firstName: 'Deepak',
        lastName: 'Patel',
        grade: 87

    },
      {
        firstName: 'Ishanvi',
        lastName: 'N',
        grade: 99

    },
       {
        firstName: 'Vanitha',
        lastName: 'V',
        grade: 65

    }
]
for(let i = 0; i < student.length; i++){
    console.log(student[i].firstName)
    console.log(student[i].grade)
    const students = student[i] //it is declared here to avoid the repetation of student[i] in the next line
    console.log(`${students.firstName} scores ${students.grade}`) //the template literals used for JS to evaluate the code.
}
//reversing the string using loop
const word = 'stressed'
let reverse = ''
for(let i = word.length-1; i >= 0; i--){
    reverse = reverse + word[i]
    console.log(reverse)

}
//another way to reverse without loop
const word1 = 'stressed'
console.log(word1.split("").reverse().join(''))

//While loop: for this initial expression comes outside the value & increment & dec will comes inside the body
/* Initial Exp
while(condition){
incriment/decriment
}
*/
let i = 0
while(i < 5){
    console.log("Hello World")
    i++
}

//For loop: when you know in advance how many times you want to repeate.
//while loop: when you don't know how many times you want to repeate.

let target = Math.floor(Math.random() * 10)//generate fraction# b/w 0 to 1
let guess = Math.floor(Math.random() * 10)

while(guess !== target){
    console.log(`Target: ${target}, Guess:${guess}`)
    guess = Math.floor(Math.random() * 10)
}
console.log('Yaayyyy you Won!!!')
console.log(`Target: ${target}, Guess:${guess}`)

/*For..of - For each of Java
its a auto incriment in nature
auto starts from left side
it can't be used for Objects
*/

const animals1 = ['lion', 'tiger', 'elepahnt']
for(const animal of animals1){
    console.log(animal)
}
for (let char of 'Deepak'){
    console.log(char)
}

//For..in : Used for objects.
const fitbit = {

    totalSteps: 30988,
    totalFloors: 1898,
    totalMiles: 211.1,
    avgCalories: 800

}
for(let data in fitbit){
    console.log(data, fitbit[data]) //[data] used since the data is dynamic expression
}
