//objectes are collection of properties. Properties are key value pair. Rather accessing data using index we use custome key.
const fitbit = {

    totalSteps: 30988,
    totalFloors: 1898,
    totalMiles: 211.1,
    avgCalories: 800

}

//Example differnt type of value we can store in object.

console.log(fitbit)

let comment = {

    userName : 'Deepak',
    downVote : 12,
    upVote : 28,
    netScore : 200,
    commentText : 'Taste like chicken lol',
    tags : ['#hilarious', '#fun', '#silly'],
    isGlided : false
}
console.log(comment.tags)    

//In JS keys are automatically converted into string

const pallete = {
    red : '#red',
    yellow : '#yellow',
    green : '#green'
}
console.log(pallete.red)
console.log(pallete.yellow)

let color = 'yellow'
console.log(pallete.color) //o/p will be undefined since the '.' is looking for literal key which is defined inside the objects.
console.log(pallete[color]) // square bracket support dynamic expressions hence o/p #yellow

//Adding and updating properties using empty object

const userReview = {}
userReview.queenBee = 4.0
userReview['MrDeepak'] = 5.5
console.log(userReview)

//Nested Arrays & Objects

const Student = {

    firstName : 'Deepak',
    lastName : 'Patel',
    strengths : ['Arts', 'Music'],
    exams: {
        midterm : 85,
        final : 78
    }
}
Student.exams.total = 300
console.log(Student.strengths[0])
console.log(Student.exams.midterm)
console.log(Student)
