

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
