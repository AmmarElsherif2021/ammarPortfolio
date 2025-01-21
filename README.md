

---

## **Core JavaScript Concepts**
### **1. Basics of JavaScript**
- **What is JavaScript?**
  - A high-level, interpreted programming language used for web development.
- **Difference between `let`, `const`, and `var`.**
  - `let` and `const` are block-scoped, while `var` is function-scoped.
  - `const` cannot be reassigned, while `let` and `var` can.
- **What is hoisting?**
  - Variables and function declarations are moved to the top of their scope during compilation.
- **What is the difference between `==` and `===`?**
  - `==` performs type coercion, while `===` checks both value and type.

---

### **2. Functions**
- **What is a closure?**
  - A function that retains access to its lexical scope even when executed outside that scope.
  - Example:
    ```javascript
    function outer() {
      let x = 10;
      return function inner() {
        console.log(x);
      };
    }
    const innerFunc = outer();
    innerFunc(); // Output: 10
    ```
- **What is an IIFE (Immediately Invoked Function Expression)?**
  - A function that is executed immediately after it’s defined.
  - Example:
    ```javascript
    (function() {
      console.log("IIFE");
    })();
    ```
- **What is the difference between `function declaration` and `function expression`?**
  - Function declarations are hoisted, while function expressions are not.

---

### **3. Objects and Prototypes**
- **What is the `this` keyword?**
  - Refers to the object that the function is a property of.
  - Example:
    ```javascript
    const obj = {
      name: "John",
      greet: function() {
        console.log(`Hello, ${this.name}`);
      },
    };
    obj.greet(); // Output: Hello, John
    ```
- **What is prototypal inheritance?**
  - Objects can inherit properties and methods from other objects via their prototype chain.
  - Example:
    ```javascript
    const parent = { name: "Parent" };
    const child = Object.create(parent);
    console.log(child.name); // Output: Parent
    ```
- **What is the difference between `Object.create` and `new`?**
  - `Object.create` creates a new object with a specified prototype.
  - `new` creates an instance of a constructor function.

---

### **4. Asynchronous JavaScript**
- **What is the event loop?**
  - A mechanism that allows JavaScript to handle asynchronous operations by offloading tasks to the browser APIs and processing them in the call stack.
- **What are promises?**
  - Objects that represent the eventual completion (or failure) of an asynchronous operation.
  - Example:
    ```javascript
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("Done"), 1000);
    });
    promise.then((result) => console.log(result)); // Output: Done
    ```
- **What is `async/await`?**
  - A syntactic sugar for working with promises, making asynchronous code look synchronous.
  - Example:
    ```javascript
    async function fetchData() {
      const response = await fetch("https://api.example.com/data");
      const data = await response.json();
      console.log(data);
    }
    ```

---

### **5. ES6+ Features**
- **What are arrow functions?**
  - A shorter syntax for writing functions, with no `this` binding.
  - Example:
    ```javascript
    const add = (a, b) => a + b;
    ```
- **What are template literals?**
  - Allow embedding expressions inside strings using backticks.
  - Example:
    ```javascript
    const name = "John";
    console.log(`Hello, ${name}`); // Output: Hello, John
    ```
- **What are destructuring and spread/rest operators?**
  - Destructuring: Extracting values from arrays or objects.
    ```javascript
    const [a, b] = [1, 2];
    const { name, age } = { name: "John", age: 30 };
    ```
  - Spread: Expanding arrays or objects.
    ```javascript
    const arr = [1, 2, 3];
    const newArr = [...arr, 4]; // [1, 2, 3, 4]
    ```
  - Rest: Collecting remaining arguments into an array.
    ```javascript
    function sum(...args) {
      return args.reduce((acc, val) => acc + val, 0);
    }
    ```

---

## **Advanced JavaScript Concepts**
### **1. Event Handling**
- **What is event delegation?**
  - A technique where you add a single event listener to a parent element to handle events for its child elements.
  - Example:
    ```javascript
    document.getElementById("parent").addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        console.log("Button clicked");
      }
    });
    ```

---

### **2. Error Handling**
- **What is `try...catch`?**
  - A block for handling exceptions.
  - Example:
    ```javascript
    try {
      throw new Error("Something went wrong");
    } catch (error) {
      console.log(error.message); // Output: Something went wrong
    }
    ```

---

### **3. Modules**
- **What are ES6 modules?**
  - A way to organize code into reusable pieces using `import` and `export`.
  - Example:
    ```javascript
    // math.js
    export const add = (a, b) => a + b;

    // main.js
    import { add } from "./math.js";
    console.log(add(1, 2)); // Output: 3
    ```

---

## **Practical JavaScript Questions**
### **1. Coding Problems**
- **Reverse a string**:
  ```javascript
  function reverseString(str) {
    return str.split("").reverse().join("");
  }
  console.log(reverseString("hello")); // Output: "olleh"
  ```
- **Find the largest number in an array**:
  ```javascript
  function findLargest(arr) {
    return Math.max(...arr);
  }
  console.log(findLargest([1, 2, 3, 4])); // Output: 4
  ```
- **Check if a string is a palindrome**:
  ```javascript
  function isPalindrome(str) {
    return str === str.split("").reverse().join("");
  }
  console.log(isPalindrome("madam")); // Output: true
  ```

---

### **2. Debugging**
- **Fix the following code**:
  ```javascript
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000);
  }
  // Output: 3, 3, 3 (Fix to output 0, 1, 2)
  ```
  - Fix:
    ```javascript
    for (let i = 0; i < 3; i++) {
      setTimeout(() => console.log(i), 1000);
    }
    ```

---

### **3. DOM Manipulation**
- **Add a new element to the DOM**:
  ```javascript
  const newElement = document.createElement("div");
  newElement.textContent = "Hello, World!";
  document.body.appendChild(newElement);
  ```

---

### **4. API Calls**
- **Fetch data from an API and display it**:
  ```javascript
  async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  }
  fetchData();
  ```

---

## **Common Interview Questions**
1. **Explain the difference between `null` and `undefined`.**
   - `null` is an intentional absence of value, while `undefined` means a variable has been declared but not assigned a value.

2. **What is the difference between `map`, `filter`, and `reduce`?**
   - `map`: Transforms each element in an array.
   - `filter`: Creates a new array with elements that pass a test.
   - `reduce`: Reduces an array to a single value.

3. **What is the difference between `call`, `apply`, and `bind`?**
   - `call` and `apply` invoke a function with a specific `this` value and arguments.
   - `bind` creates a new function with a specific `this` value.

4. **What is the difference between `setTimeout` and `setInterval`?**
   - `setTimeout` executes a function once after a delay.
   - `setInterval` executes a function repeatedly at specified intervals.

---

 Good luck! 🚀
