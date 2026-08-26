class Triangle1 {
    constructor(a, b){    //To avaoid the duplication of using myTri1.a = 3 and secondTri.a = 4. we have created the constructor.
                      //will called automatically whenever we create the new object of the class.  
    this.a = a       //class property
    this.b = b
}
     getArea() {
        return (this.a * this.b) / 2
    }

    getHypo(){
        return(Math.sqrt(this.a ** 2 + this.b ** 2))
    }
    describe(){
        return  `I am a Triangle with area of ${this.getArea()}`
    }
}

class Triangle2 extends Triangle1{  //Since we are re-using the same code hence inheriting it from parent to child class by using "extend" keyword


    describe(){
        return  `(run & hides)`
    }
}

const regularTri = new Triangle1(3, 4)
const triangle1 = new Triangle1(4, 5)
console.log(Triangle2)
console.log(triangle1.getArea())
console.log(triangle1.describe())

//Super Keyword