

# What's the Difference Between Imperative and Declarative Code?

**Declarative code** means you define the target user interface (UI) content and structure, combined with different states (e.g., "is a modal open or closed?"), and leave it up to React to figure out the appropriate DOM instructions. In contrast, **imperative code** involves manually specifying the steps to achieve the desired outcome.

---

# Why is JavaScript Used in Browsers?

### **Historical Context:**
1. **Early Adoption**: JavaScript was introduced during the early days of the web and quickly became the standard scripting language due to its integration into Netscape Navigator and Internet Explorer.
2. **Standardization**: JavaScript was standardized by ECMAScript, ensuring broad compatibility and fostering widespread adoption across all browsers.

### **Technical Reasons:**
1. **Performance**: JavaScript engines like Google's V8 are highly optimized, making JavaScript fast for client-side applications.
2. **Asynchronous Execution**: JavaScript handles asynchronous operations through **callbacks**, **promises**, and **async/await**, making it ideal for web development where non-blocking operations are crucial.
3. **Versatility**: JavaScript can be used for both front-end (React, Angular, Vue) and back-end (Node.js) development, making it a full-stack language.
4. **Rich Ecosystem**: A vast ecosystem of tools, libraries, and frameworks accelerates and enhances web development workflows.
5. **Ease of Use**: JavaScript is relatively easy to learn, contributing to its widespread adoption among developers of varying skill levels.

---

# What is React?

React is a JavaScript library for building user interfaces. It operates based on a few key principles:

### **Component-Based Architecture:**
React applications are built using **components**, which are reusable, self-contained pieces of UI. Each component can manage its own state and be composed to create complex UIs.

### **Virtual DOM:**
Instead of directly manipulating the browser’s DOM, React creates an in-memory representation called the **Virtual DOM**. When a component's state changes, React updates the Virtual DOM first, compares it with the actual DOM (a process called **reconciliation**), and updates only the parts of the DOM that have changed.

### **JSX (JavaScript XML):**
React uses **JSX** to blend HTML with JavaScript code. JSX is a syntax extension that allows you to write HTML-like code within JavaScript. It is eventually transpiled into JavaScript objects.

### **Declarative UI:**
React allows you to describe what the UI should look like for any given state. When the state changes, React updates the UI to match the new state, making the code more predictable and easier to debug.

### **ReactDOM:**
React uses **ReactDOM** to render components to the actual DOM for web applications. ReactDOM takes the React components and updates the browser’s DOM to match the Virtual DOM.

---

# What is XML?

**XML (eXtensible Markup Language)** is a versatile format for structuring, storing, and transporting data. It is both human-readable and machine-readable, making it ideal for various applications.

### **Key Features:**
1. **Self-Descriptive**: XML documents contain both data and metadata, describing the data they hold.
2. **Hierarchical Structure**: Data is organized in a tree-like structure with nested elements, making it easy to represent complex data relationships.
3. **Platform-Independent**: XML can be used across different systems and technologies.
4. **Extensible**: Users can define their own tags, making XML highly flexible.

### **Example:**
```xml
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
```

### **Uses:**
- **Data Exchange**: Commonly used for exchanging data between systems.
- **Configuration Files**: Many applications use XML for configuration settings.
- **Web Services**: Often used in web services like SOAP (Simple Object Access Protocol).

---

# What is the DOM (Document Object Model)?

The **DOM** is the "bridge" between your JavaScript code and the HTML code of the website. Via the built-in DOM API, JavaScript can create, insert, manipulate, delete, and read HTML elements and their content.

---

# React Packages: `react` and `react-dom`

React splits its core logic across two main packages:

### **1. The `react` Package:**
- A third-party JavaScript library that needs to be imported into a project.
- Used to:
  1. Use React's features (like JSX or state).
  2. Create the Virtual DOM and derive the current UI state.

### **2. The `react-dom` Package:**
- Acts as a **"translation bridge"** between React code (the Virtual DOM) and the browser’s actual DOM.
- Generates the actual DOM instructions to select, update, delete, and create DOM elements.

### **Combination of Two Packages:**
1. React creates the Virtual DOM internally.
2. React passes it to the `react-dom` package, which generates the actual DOM-manipulating instructions to update the web page.

---

# What is the Role of `package.json` and `package-lock.json`?

These files manage third-party dependencies (production or development) for your project.

---

# What is the Difference Between ReactDOM and the Virtual DOM?

### **ReactDOM:**
- **Purpose**: Updates the actual DOM to match React components.
- **Usage**: Provides methods to render React elements into the DOM and manage their lifecycle.
- **Example**: `ReactDOM.render(<App />, document.getElementById('root'))` renders the `App` component into the DOM element with the id `root`.

### **Virtual DOM:**
- **Purpose**: A lightweight, in-memory representation of the actual DOM. It allows React to perform efficient updates by minimizing direct manipulation of the actual DOM.
- **Usage**: React creates a Virtual DOM whenever a component's state changes, compares it with the previous version (reconciliation), and updates only the parts of the actual DOM that have changed.
- **Example**: When a component's state changes, React updates the Virtual DOM first, calculates the differences (diffing), and updates the actual DOM.

### **Key Differences:**
- **Role**: ReactDOM interacts with the actual DOM, while the Virtual DOM is an abstraction used to optimize updates.
- **Performance**: The Virtual DOM improves performance by reducing direct manipulations to the actual DOM.
- **Implementation**: ReactDOM is part of the React library that deals with the browser’s DOM API, while the Virtual DOM is a concept used internally by React.

---

# React Build Workflow

React in the browser is a combination of two packages: `react` and `react-dom`. With `React.createElement()`, React creates the Virtual DOM internally and passes it to the `react-dom` package, which generates the actual DOM-manipulating instructions.

### **Pre-processing:**
Tools in React projects analyze and transform code before deployment. This allows for development-only syntax like JSX, which is transformed into regular JavaScript before deployment.

---

# JSX Elements Are Treated Like Regular JavaScript Values

- **JSX** is syntactical sugar that gets transformed into `React.createElement()` calls.
- **Rules**:
  1. JSX elements must not have sibling elements in places where single values are expected (e.g., after the `return` keyword).
  2. JSX elements must always be self-closing if there is no content between the opening and closing tags.
  3. Dynamic content can be output via curly braces (e.g., `{someText}`).

---

# What Are Props in React?

**Props** make components reusable by allowing the same component to be used multiple times with different configurations.

---

# What is the Reconciliation Process in React?

**Reconciliation** is the process of updating the UI efficiently when the state or props of a component change.

### **How Reconciliation Works:**
1. **Virtual DOM**: React creates a Virtual DOM, a lightweight copy of the actual DOM.
2. **Diffing Algorithm**: React compares the new Virtual DOM with the previous one to identify differences.
3. **Minimal Updates**: React calculates the minimal number of changes required to update the actual DOM.
4. **Efficient Rendering**: React applies these changes to the actual DOM, avoiding unnecessary re-rendering.

---

# Component Lifecycle

The **component lifecycle** refers to the series of phases a component goes through from creation to removal from the DOM. It is crucial for managing state, side effects, and performance optimization.

### **Class Components:**
- **Mounting**: `constructor`, `componentDidMount`.
- **Updating**: `componentDidUpdate`.
- **Unmounting**: `componentWillUnmount`.

### **Functional Components:**
- Use **Hooks** like `useEffect` to handle lifecycle events.

---

# State Management in React

### **`useState`:**
- Manages simple, local state.
- Example: `const [count, setCount] = useState(0);`

### **`useReducer`:**
- Manages complex state logic.
- Example: `const [state, dispatch] = useReducer(reducer, initialState);`

### **Context API:**
- Shares state across multiple components without prop drilling.

---

# Higher-Order Components (HOCs) and Render Props

### **HOCs:**
- Functions that take a component and return a new component with additional props or behavior.
- Used for cross-cutting concerns like authentication or data fetching.

### **Render Props:**
- A pattern where a component’s prop is a function that returns a React element.
- Used for sharing code between components.

---

# Performance Optimization

- **`React.memo`**: Memoizes components to prevent unnecessary re-renders.
- **`useMemo`**: Memoizes values to avoid expensive recalculations.
- **`useCallback`**: Memoizes functions to avoid unnecessary re-renders.
- **Lazy Loading**: Loads components only when needed.

---

# What Are Web Components?

Web Components are a set of web platform APIs that allow you to create reusable, encapsulated HTML elements.

---
# props vs states
**props** are about receiving external data inside a component. 
**state** is about managing and updating internal data. And, most importantly, whenever such state is updated, React goes ahead and updates the parts of the UI that are affected by the state change.
# Why the returned state value declared as constant?
-   The state value returned by  `useState()`  is  **immutable**  and should not be modified directly.  
-   Declaring it as a  `const`  enforces this immutability and prevents accidental reassignment.    
-   State updates must always be performed using the state updater function provided by  `useState()`.
# How can state be shared across multiple components/ How to make state changes based on event that occurs in another component?
- If state needs to change because of some event that occurs in another component, you should lift the state up and manage it on a higher, shared level (that is, a common ancestor component).

# What is the importance of key prop in component < li >?
Most list updates **are incremental updates**, **not bulk changes**. But React can't distinguish the exact use case.
So keys help React identify elements that were rendered before and didn't change. By allowing for the unique identification of all list elements, keys also help React to move (list item) DOM elements around efficiently instead of  **destroying and rebuilding the entire DOM node**.
# What are refs and compare refs vs state:
In React, **refs** and **state** are both used to manage data, but they serve different purposes and have distinct use cases. Below is a detailed explanation of **refs**, how they differ from **state**, and when to use each.

---

## **What are Refs?**

**Refs** (short for "references") are a way to access and interact with DOM elements or React components directly. They provide a way to "hold" a reference to a DOM node or a React component instance.

### **Key Characteristics of Refs:**
1. **Direct DOM Access**: Refs allow you to directly access and manipulate DOM elements.
2. **Mutable**: Unlike state, refs are mutable and do not trigger re-renders when their value changes.
3. **Persist Across Renders**: Ref values persist across component re-renders.
4. **Use Cases**:
   - Managing focus, text selection, or media playback.
   - Integrating with third-party DOM libraries.
   - Accessing DOM elements for measurements or animations.

---

### **How to Create and Use Refs**

#### **1. Using `useRef` Hook (Functional Components):**
The `useRef` hook is the most common way to create refs in functional components.

```javascript
import React, { useRef } from "react";

function MyComponent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Access the DOM element and focus it
  };

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

- `useRef` returns a mutable object with a `current` property, which holds the reference to the DOM element or component instance.
- Changes to `ref.current` do not trigger re-renders.



---

## **Refs vs. State**

| **Feature**              | **Refs**                                      | **State**                                     |
|--------------------------|-----------------------------------------------|-----------------------------------------------|
| **Purpose**              | Access and manipulate DOM elements or components. | Manage and update component data that affects rendering. |
| **Mutability**           | Mutable (changes do not trigger re-renders).  | Immutable (changes trigger re-renders).       |
| **Re-renders**           | Do not cause re-renders when updated.         | Cause re-renders when updated.                |
| **Persistence**          | Persist across renders.                       | Reset or update on re-renders.                |
| **Use Cases**            | - Direct DOM manipulation (e.g., focus, scroll). <br> - Integrating with third-party libraries. | - Managing UI state (e.g., form inputs, toggles). <br> - Triggering re-renders based on data changes. |
| **Example**              | `const inputRef = useRef(null);`              | `const [count, setCount] = useState(0);`      |

---

## **When to Use Refs vs. State**

### **Use Refs When:**
1. You need to **directly access or manipulate a DOM element** (e.g., focus an input, scroll to a position).
2. You are **integrating with third-party libraries** that require direct DOM access.
3. You need to **store mutable values** that do not affect rendering (e.g., timers, previous values).

### **Use State When:**
1. You need to **manage data that affects the UI** (e.g., form inputs, toggles, counters).
2. You want to **trigger re-renders** when data changes.
3. You need to **store values that are tied to the component's lifecycle** and should reset or update on re-renders.

---

## **Example: Refs vs. State**

### **Using State (for UI Updates):**
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```
- Here, `count` is part of the component's state, and updating it triggers a re-render.

---

### **Using Refs (for Direct DOM Manipulation):**
```javascript
function FocusInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Directly manipulate the DOM
  };

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```
- Here, `inputRef` is used to directly access and manipulate the DOM element without triggering a re-render.

---

## **Key Takeaways**
- **Refs** are used for **direct DOM manipulation** and storing **mutable values** that do not trigger re-renders.
- **State** is used for **managing data** that affects the UI and triggers re-renders when updated.
- Use **refs** when you need to interact with the DOM or store values that persist across renders without causing re-renders.
- Use **state** when you need to manage data that affects the component's rendering and behavior.
# Explain forwardRef() in React:
## **Why is  `forwardRef`  Needed?**

By default, React does not allow  `ref`  to be passed as a prop to functional components because  `ref`  is a special attribute (like  `key`). If you try to pass a  `ref`  directly as a prop, React will ignore it.

For example:

javascript

Copy

function ChildComponent({ ref }) {
  return <input ref={ref} />; // This won't work!
}

To solve this problem, React provides the  `forwardRef`  function, which allows you to forward the  `ref`  to a child component.

----------

## **How Does  `forwardRef`  Work?**

`forwardRef`  is a function that takes a  **component**  as an argument and returns a new component that can accept a  `ref`  as a second argument. The child component can then attach this  `ref`  to a DOM element or another component.

### **Syntax:**

javascript

Copy

const ChildComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>Child Component</div>;
});

-   The first argument (`props`) contains the props passed to the component.
    
-   The second argument (`ref`) is the  `ref`  passed from the parent component.
    

----------

## **Example: Using  `forwardRef`**

### **Parent Component:**

```
import React, { useRef } from "react";
import ChildComponent from "./ChildComponent";
function ParentComponent() {
  const inputRef = useRef(null);
  const focusInput = () => {
    inputRef.current.focus(); // Access the child's input element
  };

  return (
    <div>
      <ChildComponent ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```
### **Child Component (using  `forwardRef`):**

```
import React from "react";
const ChildComponent = React.forwardRef((props, ref) => {
  return <input type="text" ref={ref} />; // Forward the ref to the input element
});
```
export default ChildComponent;

---------
## **Key Points About  `forwardRef`**

1.  **Forwarding Refs to DOM Elements**:
    -   You can forward a  `ref`  to a DOM element (e.g., an  `input`,  `div`, etc.) inside the child component.
        
2.  **Forwarding Refs to Class Components**
    -   You can also forward a  `ref`  to a class component instance, allowing the parent to access the child's methods or properties.
        
3.  **Use Cases**:
    -   **Focus Management**: Focus an input field in a child component.   
    -   **Animations**: Trigger animations on a DOM element in a child component.        
    -   **Third-Party Libraries**: Integrate with libraries that require direct DOM access.

# controlled vs uncontrolled components
...


---

# **What is `useCallback`?**

`useCallback` is a hook that **memoizes a function**, meaning it returns a memoized (cached) version of the function that only changes if one of its dependencies changes. This is useful for optimizing performance, especially when passing callbacks to child components that rely on reference equality to prevent unnecessary re-renders.

### **Syntax:**
```javascript
const memoizedCallback = useCallback(() => {
  // Function logic
}, [dependencies]);
```

- The first argument is the function you want to memoize.
- The second argument is an array of dependencies. The function will only be recreated if one of these dependencies changes.

### **Example:**
```javascript
import React, { useCallback, useState } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []); // No dependencies, so the function is memoized once

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onIncrement={increment} />
    </div>
  );
}

function ChildComponent({ onIncrement }) {
  return <button onClick={onIncrement}>Increment</button>;
}
```

---

## **What is `useEffect`?**

`useEffect` is a hook that allows you to perform **side effects** in functional components. It runs after the component renders and can be used for tasks like fetching data, setting up subscriptions, or manually updating the DOM.

### **Syntax:**
```javascript
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup logic (optional)
  };
}, [dependencies]);
```

- The first argument is a function that contains the side effect logic.
- The second argument is an array of dependencies. The effect will only re-run if one of these dependencies changes.
- You can optionally return a cleanup function to handle tasks like unsubscribing from events or canceling timers.

### **Example:**
```javascript
import React, { useEffect, useState } from "react";

function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // No dependencies, so the effect runs only once

  return <p>Time: {time} seconds</p>;
}
```

---

## **`useCallback` vs `useEffect`**

| **Feature**              | **`useCallback`**                              | **`useEffect`**                              |
|--------------------------|------------------------------------------------|----------------------------------------------|
| **Purpose**              | Memoizes a function to optimize performance.   | Performs side effects after rendering.       |
| **When It Runs**         | Returns a memoized function.                   | Runs after the component renders.            |
| **Dependencies**         | Recreates the function if dependencies change. | Re-runs the effect if dependencies change.   |
| **Use Cases**            | - Preventing unnecessary re-renders. <br> - Passing stable callbacks to child components. | - Fetching data. <br> - Setting up subscriptions. <br> - Manually updating the DOM. |
| **Example**              | Memoizing a callback function.                 | Fetching data from an API.                   |

---

## **Key Differences**

1. **Purpose**:
   - `useCallback`: Optimizes performance by memoizing functions.
   - `useEffect`: Handles side effects like data fetching or DOM updates.

2. **Execution**:
   - `useCallback`: Returns a memoized function that only changes if dependencies change.
   - `useEffect`: Runs after the component renders and can optionally clean up when the component unmounts.

3. **Use Cases**:
   - `useCallback`: Used when passing callbacks to child components to prevent unnecessary re-renders.
   - `useEffect`: Used for tasks that need to happen after rendering, such as API calls or subscriptions.

---

## **When to Use Each**

### **Use `useCallback` When:**
- You need to pass a stable callback to a child component.
- You want to avoid unnecessary re-renders caused by function recreations.

### **Use `useEffect` When:**
- You need to perform side effects like fetching data, updating the DOM, or setting up subscriptions.
- You need to clean up resources (e.g., unsubscribe from events) when the component unmounts.

---

## **Example: Combining `useCallback` and `useEffect`**

```javascript
import React, { useState, useCallback, useEffect } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []); // Memoized callback

  useEffect(() => {
    console.log("Count updated:", count);
  }, [count]); // Side effect that runs when `count` changes

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onIncrement={increment} />
    </div>
  );
}

function ChildComponent({ onIncrement }) {
  return <button onClick={onIncrement}>Increment</button>;
}
```

---

## **Key Takeaways**

- **`useCallback`**: Memoizes functions to optimize performance and prevent unnecessary re-renders.
- **`useEffect`**: Handles side effects like data fetching, DOM updates, and cleanup tasks.
- Use `useCallback` for stable callbacks and `useEffect` for side effects.

# In React, **`memo`** is a higher-order component (HOC) used to optimize functional components by preventing unnecessary re-renders. It works by **memoizing** the component, meaning it will only re-render if its **props** change. This is particularly useful for improving performance in applications with complex UIs or frequent re-renders.

---

# **What is `memo`?**

- **`memo`** is a function that wraps a functional component and returns a memoized version of it.
- The memoized component will only re-render if:
  1. Its **props** change.
  2. Its **internal state** or **context** changes.
- If the props remain the same, the component will skip re-rendering, improving performance.

---

## **How Does `memo` Work?**

When you wrap a component with `memo`, React performs a **shallow comparison** of the previous and new props. If the props are the same, React reuses the previously rendered result, avoiding unnecessary re-renders.

---

## **Syntax:**

```javascript
import React, { memo } from "react";

const MyComponent = memo((props) => {
  // Component logic
  return <div>{props.value}</div>;
});
```

---

## **When to Use `memo`?**

Use `memo` in the following scenarios:
1. **Pure Functional Components**:
   - Components that always render the same output for the same props.
2. **Expensive Re-renders**:
   - Components that are computationally expensive to render.
3. **Frequent Re-renders**:
   - Components that re-render often but rarely have prop changes.
4. **Parent-Child Relationships**:
   - When a parent component re-renders, but the child component doesn’t need to.

---

## **Example: Using `memo`**

### **Without `memo`:**
```javascript
import React, { useState } from "react";

function ChildComponent({ value }) {
  console.log("ChildComponent re-rendered");
  return <div>{value}</div>;
}

function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Parent Count: {count}</p>
      <ChildComponent value="Hello" />
    </div>
  );
}
```

- **Problem**: Every time the parent component re-renders (e.g., when `count` changes), the `ChildComponent` also re-renders, even though its props (`value`) haven’t changed.

---

### **With `memo`:**
```javascript
import React, { useState, memo } from "react";

const ChildComponent = memo(({ value }) => {
  console.log("ChildComponent re-rendered");
  return <div>{value}</div>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Parent Count: {count}</p>
      <ChildComponent value="Hello" />
    </div>
  );
}
```

- **Solution**: The `ChildComponent` is memoized, so it only re-renders if its props (`value`) change. In this case, since `value` is always `"Hello"`, the child component does not re-render when the parent updates.

---

## **Custom Comparison Function**

By default, `memo` performs a **shallow comparison** of props. If you need more control, you can provide a **custom comparison function** as the second argument to `memo`.

### **Syntax:**
```javascript
const MyComponent = memo((props) => {
  // Component logic
}, arePropsEqual);
```

- The `arePropsEqual` function takes two arguments:
  1. `prevProps`: The previous props.
  2. `nextProps`: The new props.
- Return `true` if the props are equal (no re-render), or `false` if they are not (re-render).

### **Example:**
```javascript
import React, { memo } from "react";

const ChildComponent = memo(
  ({ value }) => {
    console.log("ChildComponent re-rendered");
    return <div>{value}</div>;
  },
  (prevProps, nextProps) => {
    // Only re-render if `value` changes
    return prevProps.value === nextProps.value;
  }
);
```

---

## **When NOT to Use `memo`**

1. **Components with Frequent Prop Changes**:
   - If the props change often, `memo` won’t provide any benefit.
2. **Components with Simple Rendering Logic**:
   - If the component is lightweight, the overhead of `memo` might outweigh its benefits.
3. **Components with Internal State or Context**:
   - `memo` only prevents re-renders based on prop changes. If the component relies on state or context, it will still re-render when those change.

---

## **Best Practices for Using `memo`**

1. **Profile First**:
   - Use React DevTools to identify performance bottlenecks before applying `memo`.
2. **Memoize Wisely**:
   - Only memoize components that are expensive to render or re-render frequently.
3. **Combine with `useCallback`**:
   - If passing callbacks as props, use `useCallback` to memoize the callback and prevent unnecessary re-renders.

---

## **Example: Combining `memo` and `useCallback`**

```javascript
import React, { useState, memo, useCallback } from "react";

const ChildComponent = memo(({ value, onClick }) => {
  console.log("ChildComponent re-rendered");
  return <button onClick={onClick}>{value}</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Button clicked");
  }, []); // Memoized callback

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Parent Count: {count}</p>
      <ChildComponent value="Click Me" onClick={handleClick} />
    </div>
  );
}
```

- **Explanation**:
  - `ChildComponent` is memoized to prevent unnecessary re-renders.
  - `handleClick` is memoized using `useCallback` to ensure the same callback reference is passed to `ChildComponent`.

---

### **Key Takeaways**

- **`memo`** is used to prevent unnecessary re-renders of functional components.
- It works by memoizing the component and only re-rendering if the props change.
- Use `memo` for pure components, expensive renders, or frequent re-renders.
- Combine `memo` with `useCallback` for optimal performance when passing callbacks as props.
- Avoid overusing `memo` for lightweight components or components with frequent prop changes.

------
# In React, different storage types are used to manage and persist data:

---

### 1. **Component State (`useState` or `this.state`)**
- **Where it's stored**: In memory (RAM) as part of the component's instance.
- **Scope**: Local to the component.
- **Persistence**: Temporary; lost when the component unmounts.
- **Example**:
  ```javascript
  import React, { useState } from 'react';

  function Counter() {
    const [count, setCount] = useState(0); // Stored in memory

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  }
  ```

---

### 2. **Context API (`React.createContext`)**
- **Where it's stored**: In memory (RAM) as part of the React component tree.
- **Scope**: Global within the component tree where the context is provided.
- **Persistence**: Temporary; lost on page refresh.
- **Example**:
  ```javascript
  import React, { createContext, useContext } from 'react';

  const ThemeContext = createContext(); // Stored in memory

  function App() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }

  function Toolbar() {
    const theme = useContext(ThemeContext);
    return <div>Current Theme: {theme}</div>;
  }
  ```

---

### 3. **Local Storage (`window.localStorage`)**
- **Where it's stored**: In the browser's local storage (persistent storage on the user's device).
- **Scope**: Global across the entire application.
- **Persistence**: Persistent; data remains until explicitly cleared.
- **Example**:
  ```javascript
  import React, { useState, useEffect } from 'react';

  function App() {
    const [name, setName] = useState(localStorage.getItem('name') || '');

    useEffect(() => {
      localStorage.setItem('name', name); // Stored in browser's local storage
    }, [name]);

    return (
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <p>Hello, {name || 'Guest'}!</p>
      </div>
    );
  }
  ```

---

### 4. **Session Storage (`window.sessionStorage`)**
- **Where it's stored**: In the browser's session storage (temporary storage for the duration of the page session).
- **Scope**: Global across the entire application.
- **Persistence**: Temporary; data is cleared when the session ends (tab or browser is closed).
- **Example**:
  ```javascript
  import React, { useState, useEffect } from 'react';

  function App() {
    const [theme, setTheme] = useState(sessionStorage.getItem('theme') || 'light');

    useEffect(() => {
      sessionStorage.setItem('theme', theme); // Stored in browser's session storage
    }, [theme]);

    return (
      <div>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
        <p>Current Theme: {theme}</p>
      </div>
    );
  }
  ```

---

### 5. **Redux (or Other State Management Libraries)**
- **Where it's stored**: In memory (RAM) as part of the Redux store.
- **Scope**: Global across the entire application.
- **Persistence**: Temporary by default, but can be combined with `localStorage` or `sessionStorage` for persistence.
- **Example**:
  ```javascript
  import { createStore } from 'redux';
  import { Provider, useSelector, useDispatch } from 'react-redux';

  const initialState = { count: 0 };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      default:
        return state;
    }
  }

  const store = createStore(reducer); // Stored in memory

  function Counter() {
    const count = useSelector((state) => state.count);
    const dispatch = useDispatch();

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      </div>
    );
  }

  function App() {
    return (
      <Provider store={store}>
        <Counter />
      </Provider>
    );
  }
  ```

---

### 6. **Cookies**
- **Where it's stored**: In the browser's cookie storage (small text files stored on the user's device).
- **Scope**: Global across the entire application.
- **Persistence**: Persistent; can have an expiration date.
- **Example**:
  ```javascript
  import React, { useEffect } from 'react';
  import Cookies from 'js-cookie';

  function App() {
    useEffect(() => {
      Cookies.set('username', 'JohnDoe', { expires: 7 }); // Stored in browser's cookies
    }, []);

    const username = Cookies.get('username');

    return (
      <div>
        <p>Welcome, {username}!</p>
      </div>
    );
  }
  ```

---

### 7. **IndexedDB**
- **Where it's stored**: In the browser's IndexedDB database (a low-level API for storing large amounts of structured data).
- **Scope**: Global across the entire application.
- **Persistence**: Persistent; data remains until explicitly cleared.
- **Example**:
  ```javascript
  import React, { useEffect } from 'react';

  function App() {
    useEffect(() => {
      const request = indexedDB.open('MyDatabase', 1); // Stored in browser's IndexedDB

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('users', 'readwrite');
        const store = transaction.objectStore('users');
        store.add({ id: 1, name: 'Alice' });
      };
    }, []);

    return <div>IndexedDB Example</div>;
  }
  ```

---

### Summary Table:

| Storage Type         | Where it's Stored                  | Scope          | Persistence         | Use Case                                      |
|----------------------|------------------------------------|----------------|---------------------|----------------------------------------------|
| Component State      | In memory (RAM)                   | Local          | Temporary           | Managing local component state               |
| Context API          | In memory (RAM)                   | Global (Tree)  | Temporary           | Sharing global data across components        |
| Local Storage        | Browser's local storage           | Global         | Persistent          | Persisting data across browser sessions      |
| Session Storage      | Browser's session storage         | Global         | Temporary (Session) | Persisting data for a single session         |
| Redux/State Libraries| In memory (RAM)                   | Global         | Temporary           | Managing complex global state                |
| Cookies              | Browser's cookie storage          | Global         | Persistent          | Storing small data sent to the server        |
| IndexedDB            | Browser's IndexedDB database      | Global         | Persistent          | Storing large structured data                |

---
# Cookies and sessions
The relationship between **cookies** and **sessions** is fundamental to how web applications manage user state and authentication. Here's a breakdown of their connection:

---

### **What are Cookies?**
- **Definition**: Cookies are small pieces of data stored in the user's browser. They are sent to the server with every HTTP request.
- **Storage Location**: Browser's cookie storage.
- **Persistence**: Can be persistent (with an expiration date) or session-based (deleted when the browser is closed).
- **Use Case**: Often used to store session identifiers, user preferences, or tracking information.

---

### **What are Sessions?**
- **Definition**: Sessions are server-side storage mechanisms used to maintain user-specific data across multiple requests.
- **Storage Location**: Server memory, a database, or a file system.
- **Persistence**: Temporary; sessions expire after a certain period of inactivity or when the user logs out.
- **Use Case**: Used to store sensitive or large amounts of data (e.g., user authentication status, shopping cart items).

---

### **How Cookies and Sessions Work Together**
1. **Session Creation**:
   - When a user logs in or interacts with a web application, the server creates a unique **session ID**.
   - This session ID is used to identify the user's session on the server.

2. **Session ID Storage**:
   - The server sends the session ID to the browser as a **cookie**.
   - The browser stores this cookie and includes it in every subsequent request to the server.

3. **Session Management**:
   - On each request, the server reads the session ID from the cookie.
   - The server uses this ID to retrieve the corresponding session data from its storage (e.g., memory, database).

4. **Session Expiry**:
   - Sessions typically expire after a period of inactivity or when the user logs out.
   - The cookie containing the session ID may also expire, depending on its configuration.

---

### **Example Workflow**
1. **User Logs In**:
   - The server creates a session and stores user data (e.g., `{ userId: 123, isLoggedIn: true }`) in its memory or database.
   - The server sends a cookie with the session ID (e.g., `sessionId=abc123`) to the browser.

2. **Subsequent Requests**:
   - The browser automatically includes the session ID cookie in every request to the server.
   - The server reads the session ID, retrieves the corresponding session data, and uses it to personalize the response.

3. **User Logs Out**:
   - The server deletes the session data and invalidates the session ID.
   - The browser may also delete the session ID cookie, depending on its configuration.

---

### **Key Differences Between Cookies and Sessions**
| Feature            | Cookies                          | Sessions                        |
|--------------------|----------------------------------|---------------------------------|
| **Storage Location**| Browser (client-side)            | Server (server-side)            |
| **Data Size**       | Limited (4KB per cookie)         | Can store larger amounts of data|
| **Security**        | Less secure (can be manipulated) | More secure (server-controlled) |
| **Persistence**     | Can be persistent or temporary   | Temporary (expires after inactivity) |

---

### **Why Use Cookies for Sessions?**
- **Stateless Nature of HTTP**: HTTP is stateless, meaning each request is independent. Cookies allow the server to identify the user across multiple requests.
- **Efficiency**: Storing only a session ID in a cookie reduces the amount of data sent between the client and server.
- **Scalability**: Sessions can be stored in distributed systems (e.g., databases) for scalability, while cookies handle the client-side identification.

---

### **Alternative to Cookies for Sessions**
- **URL-Based Sessions**: Session IDs can be passed as URL parameters instead of cookies. However, this is less secure and less convenient.
- **Token-Based Authentication**: Modern applications often use tokens (e.g., JWT) stored in cookies or local storage instead of traditional session IDs.

---

### **Summary**
- **Cookies** are used to store the **session ID** on the client side.
- **Sessions** store user-specific data on the server side.
- Together, they enable web applications to maintain state and provide personalized experiences for users.

Let me know if you need further clarification!

# Questions
1. What is "conditional content"? 
2.  Name at least two different ways of rendering JSX elements conditionally. 
3. Which elegant approach can be used to define element tags conditionally? 
4. What's a potential downside of using only ternary expressions (for conditional content)? 
5. How can lists of data be rendered as JSX elements? 
6. Why should keys be added to rendered list items? 
7. Give one example each for a good and a bad key.

# Questions:

1. What is React?
2. Which advantage does React offer over vanilla JavaScript projects?
3. What is a Single-Page-Application (SPA)?
4. How can you create new React projects, and why do you need such a complex project setup?
5. Differentiate between features like **callbacks**, **promises**, and **async/await**.
6. Library vs. Framework.
7. What's the idea behind using components?
8. How can you create a React component?
9. What turns a regular function into a React component function?
10. Which core rules should you keep in mind regarding JSX elements?
11. How is JSX code handled by React and ReactDOM?
12. Which "problem" do props solve?
13. How are props passed into components?
14. How are props consumed inside a component function?
15. Which options exist for passing (multiple) props into components?

---
