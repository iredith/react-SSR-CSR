# React SSR

To achieve server-side rendering (ssr) and client-side rendering(csr) using webpack, you can follow a basic configurations for the server and the client. This setup allows you to render your initial page on the server on the server for SEO benefits and faster initial load times, and then take over rendering on the client side for a dynamic single page application (SPA) experience.

## Step 1: Setup Your Project

1. **Initialize your project**

    ```bash
    npm init -y
    ```

2. **Install dependencies**:

    - React and reactDOM for UI
    - Babel for JSX and ES6+ support
    - Webpack loaders for bundling
    - Express for server
    - Webpack node externals for server
    - Webpack dev server for development

    ```bash
       npm install react react-dom express
   npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli webpack-node-externals
    ```

3. **Setup Babel**: Create a `.babelrc` file for Babel configurations.

    ```json
    {
      "presets": ["@babel/preset-env", "@babel/preset-react"]
    }
    ```

## Step 2: Create a Webpack Configuration

1. **Client-side config** (`webpack.client.config.js`):

    ```js
    const path = require('path');

    module.exports = {
      entry: './src/client/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
    };
    ```

2. **Server-side config** (`webpack.server.config.js`):

    ```js
    const path = require('path');
    const nodeExternals = require('webpack-node-externals');

    module.exports = {
      target: 'node',
      entry: './src/server/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
      },
      externals: [nodeExternals()],
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
    };
    ```

## Step 3: Implement SSR and CSR

1. **Server-side rendering**:

    - Create an Express server that renders the initial HTML.
    - Use ReactDOMServer.renderToString to render your React component to a string.

    ```js
    const express = require('express');
    const React = require('react');
    const ReactDOMServer = require('react-dom/server');
    const App = require('../shared/App').default;

    const server = express();

    server.use(express.static('dist'));

    server.get('*', (req, res) => {
      const appString = ReactDOMServer.renderToString(React.createElement(App));

      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>My SSR App</title></head>
        <body>
          <div id="root">${appString}</div>
          <script src="bundle.js"></script>
        </body>
        </html>
      `);
    });

    server.listen(3000, () => console.log('Server is running on http://localhost:3000'));
    ```

2. **Client-side rendering**:

    - Implement the entry point for your client-side application.
    - Use ReactDOM.createRoot to attach your React app to the server-rendered HTML.

    ```jsx
    import React from 'react';
    import { createRoot } from 'react-dom/client';

    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
    ```

## Step 4: Build and Run

1. **Add build scripts** to your `package.json`:

   ```json
   {
     "scripts": {
       "build:client": "webpack --config webpack.client.config.js",
       "build:server": "webpack --config webpack.server.config.js",
       "build": "npm run build:client && npm run build:server",
       "start": "node dist/server.js"
     }
   }
   ```

2. **Build your application**:

   ```bash
   npm run build
   ```

3. **Start your server**:

   ```bash
   npm start
   ```

To further enhance your SSR and CSR setup, consider the following additions:

1. **Install loaders** for CSS/SCSS:

   ```bash
   npm install --save-dev style-loader css-loader sass-loader node-sass
   ```

2. **Update Webpack configs** to include rules for CSS/SCSS files. For the client-side config (`webpack.client.config.js`), add:

   ```javascript
   // Inside module.rules array
   {
     test: /\.css$/,
     use: ['style-loader', 'css-loader']
   },
   {
     test: /\.scss$/,
     use: ['style-loader', 'css-loader', 'sass-loader']
   }
   ```

For server-side rendering, handling styles is a bit more complex as you might need to implement critical CSS loading or use libraries like `styled-components` for CSS-in-JS solutions, which can handle SSR natively.

## Step 5: Code Splitting

Webpack supports code splitting out of the box, which can significantly improve your application's load time by only loading the necessary code chunks when they're needed.

1. **Dynamic imports**: Use `import()` syntax to dynamically import modules. Webpack will automatically split these into separate chunks.

    ```jsx
    // Example of dynamic import
    import(/* webpackChunkName: "myChunkName" */ './someModule').then((module) => {
      // Use module.default here
    });
    ```

2. **Configure Webpack**: Ensure your Webpack configuration supports code splitting. For most setups, Webpack's default settings handle this automatically, especially when using the `optimization.splitChunks` option.

## Server-Side Data Fetching

For a complete SSR experience, you might need to fetch data on the server before rendering your application. This ensures that the rendered HTML includes dynamic data, improving SEO and initial load performance.

1. **Data fetching in components**: Design your components to fetch data in a universally compatible way, using lifecycle methods or hooks that work both on the server and the client.

2. **Server-side logic**: Before rendering the React application on the server, fetch all necessary data. This might involve matching the current route to determine which components need data and then waiting for all data to load before rendering.

## Creating the `App` Component

1. **Create a shared directory**: This is where components shared between the server and client will live.

   ```bash
   mkdir -p src/shared
   ```

2. **Create the `App` component** (`src/shared/App.js`):

   ```javascript:src/shared/App.js
   import React from 'react';

   const App = () => (
     <div>
       <h1>Hello, SSR and CSR!</h1>
       <p>This is a simple React component demonstrating server-side and client-side rendering.</p>
     </div>
   );

   export default App;
   ```

This component is intentionally simplistic to focus on the setup of SSR and CSR with Webpack. In a real-world application, your `App` component would likely be more complex, potentially involving routing (e.g., using `react-router` for client-side routing and matching routes for server-side rendering), state management (e.g., using Redux or Context API), and more sophisticated layout and styling.

This setup ensures that your initial page load is fast and SEO-friendly thanks to server-side rendering, while still providing a dynamic, single-page application experience once the JavaScript loads and runs in the browser.

## Conclusion

This guide provides a starting point for setting up SSR and CSR with Webpack. Depending on your project's complexity, you may need to introduce additional configurations and optimizations. Always refer to the latest Webpack documentation and community best practices to ensure your setup is efficient and up-to-date.
