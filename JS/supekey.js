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
        return  `Area is ${this.getArea()}`
    }
}

class colorTri extends Triangle1{  //adding addition property called color hence recreating the new constructer

constructor (a, b, color){
    super(a, b)             //super keyword is used since we can't copy the same constructor (this.a & this.b) of parent with chiled.
    this.color = color
}
   
}
const tri = new colorTri(3, 4, "red")
console.log(tri)