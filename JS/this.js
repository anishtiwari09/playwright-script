//This keyword is always return an object
const person = {

    firstName: 'Deepak',
    lastName: 'Patel',
    nickName: 'Deepu',
    fullName(){ // its a method
        //console.log(`${this.firstName} ->${this.lastName}` )
        const {firstName, lastName, nickName} = this  //Destructuring the object
        console.log(`${firstName} ${lastName} -> ${nickName}`)

    }
}
person.nickName = 'Pate' //updating the nickname with new value
person.fullName() // it always take the updated value

//Left of dot rule
