const { error } = require("node:console")

//Belwo are the stand alone function
function getTriangleArea(a, b){
    return (a * b)/2
}

function getTriangleHypo(a, b){
    return Math.sqrt( a ** 2 + b ** 2)
}

console.log(getTriangleArea(3, 4))
console.log(getTriangleHypo(3, 4))

//Restructing it with objects. But the bwlow code is not good if we have to calculate it for many triangles its a drwback.
//To overcome this issue we have to use "classs"

let myTri = {  // myTri is a object
    a: 3,
    b: 4,
    getArea(){
        return ((this.a * this.b)/2) 
    },
    getHypo(){
        return(Math.sqrt(this.a ** 2 + this.b ** 2))
    }
}
console.log(myTri.getArea())
console.log(myTri.getHypo())

//Classes: (Modren JS ES2015/ES6) Will help to avoid the repetation of codes again and again. Classes are highly reusable.


class Triangle{ //Class is create because we can create as many object we can create.
     getArea(){
        return ((this.a * this.b)/2) 
    }

    getHypo(){
        return(Math.sqrt(this.a ** 2 + this.b ** 2))
    }
}

const myTri1 = new Triangle ()  //new memory is created in heap memory
myTri1.a = 3
myTri1.b = 4
console.log(myTri1.getArea())
console.log(myTri1.getHypo())

const secondTri = new Triangle()
secondTri.a = 4
secondTri.b = 5
console.log(secondTri.getArea())
console.log(secondTri.getHypo())

//Constructors

class Triangle1{ 

constructor(a, b){    //To avaoid the duplication of using myTri1.a = 3 and secondTri.a = 4. we have created the constructor.
                      //will called automatically whenever we create the new object of the class.  
    
    if (!Number.isFinite(a) || a <= 0) // if a not a number or less than 0
        throw new error(`Invalid ${a}`)
    if (!Number.isFinite(b) || a <= 0)
        throw new error(`Invalid ${b}`)
    this.a = a       //class property
    this.b = b
}
     getArea(){
        return ((this.a * this.b)/2) 
    }

    getHypo(){
        return(Math.sqrt(this.a ** 2 + this.b ** 2))
    }
}

let myTri1 = new Triangle1(3, 5)
console.log(myTri1.getArea())
