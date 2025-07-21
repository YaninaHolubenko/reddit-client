# Reddit Client

A fast, clean, and fully tested Reddit browser built with React, Redux Toolkit, and React Router.  
Created as a portfolio project to showcase real-world, maintainable code and professional testing practices.

---

## ✨ Features

- Browse popular subreddits and Reddit posts
- Search posts by keywords
- Responsive UI: desktop and mobile support, including burger menu
- View post details and comments with Markdown/HTML rendering
- Category selection with active highlight
- Full test coverage (Jest + React Testing Library)
- Caching to avoid redundant API calls

---

## ⚡️ Live Demo

[Demo Link Here (if deployed)]

---

## 🚀 Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/YaninaHolubenko/reddit-client.git
    cd reddit-client
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the app:**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000)

4. **Run tests:**
    ```bash
    npm test
    ```

---

## 📁 Project Structure

```
src/
  app/              # Main app setup, routing, root components
    __tests__/      # Tests for App-level components
    App.css
    App.js
    store.js
  components/       # UI components (each with its own CSS)
    __tests__/      # Tests for each UI component
    BurgerMenu.css 
    BurgerMenu.js
    ...
  features/         # Redux slices, thunks, selectors
    __tests__/      # Tests for Redux logic (slices, thunks, selectors)
    allPostsSlice.js
    commentsSlice.js
    ...
  hooks/            # Custom hooks
  index.css         # Global styles
  index.js          # React entry point
  setupTests.js     # Test setup file 
```

- Component CSS: Each component has its own .css file for easier maintenance and modularity.

- Tests: Tests are colocated in __tests__ folders next to code for clarity and coverage.

## 🛠️ Reddit API: CORS & Rate Limiting Notes
- Reddit CORS Policy: Reddit's public API does not send CORS headers, so direct requests from the browser can be blocked in production.

- Workaround: For local development, you may need to use a CORS proxy (e.g. https://cors-anywhere.herokuapp.com/) or run in a browser with CORS disabled.
Note: All fetch calls in postsThunks.js can be switched to use a proxy by replacing the base URL.

- Caching: To minimise API requests and avoid hitting Reddit rate limits, all API calls are cached locally for 5 minutes.

## 🧪 Testing
- Coverage: All major features are tested with Jest + React Testing Library.

- Mocking: API calls and navigation are properly mocked for isolation and reliability.

## 💡 Tech Stack
React (functional, hooks-only)

Redux Toolkit (slices, async thunks, selectors)

React Router v6

FontAwesome for icons

react-emoji-render for emoji support

Markdown & HTML parsing: marked, dompurify, html-react-parser

## 📌 License
MIT