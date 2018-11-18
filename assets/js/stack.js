class Stack { 
    // Array is used to implement stack 
        constructor() 
        { 
            this.items = []; 
        } 

        push(element) {
            this.items.push(element); 
        } 

        pop() { 
            if (this.items.length == 0) 
                return "Underflow"; 
            return this.items.pop(); 
        } 

        peek() { 
            return this.items[this.items.length - 1]; 
        } 

        isEmpty() { 
            return this.items.length == 0; 
        } 
        
        empty(){
            this.items = [];
        }

        printStack() 
        {        
            for (var i = 0; i < this.items.length; i++) 
                console.log(this.items.pop()); 
        } 
  } 
  module.exports = Stack;