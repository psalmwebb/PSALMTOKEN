import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client';
import App from './App';
import "./css/bootstrap.min.css";
import './index.css';
import Web3ContextProvider from './contexts/web3ContextProvider';


const root = createRoot(document.querySelector("#root"));

const Index = ()=> (
    <Web3ContextProvider>
        <App/>
    </Web3ContextProvider>
)

let container = null;

document.addEventListener('DOMContentLoaded', function(event) {
    if (!container) {
      container = document.getElementById('root');
      const root = createRoot(container)
      root.render(
        <React.StrictMode>
          <Index/>
        </React.StrictMode>
      );
    }
});

