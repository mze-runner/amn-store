# AMN Store

Amn Store or Request store is a tiny module build on top of [express](https://expressjs.com/) to allow you to centralize and manage your data under Request object and pass it through the middleware chain.

> Please note Amn Store is tightly-coupled with [express](#https://expressjs.com/)

## Initialization

Before use, you have to init the storage in your middleware chain.

```javascript
const express = require('express');
const store = require('amn-store');

const app = express();

app.use(store.init);
```

> Please note `store.init` must be put into middleware chain before your routers.

## Usage

To store and retrieve data Amn Store provides array-like functions, e.g. `push`, `pull`, `pop`.

Example:

```javascript
const store = require('amn-store');

const middlewareOne = (req, res, next) => {

    const someObject { one: 'one', two: 'two' };

    store.push(req, { name: 'SOME_OBJECT', data: someObject});
    next();
}

const middlewareTwo = (req, res, next) => {

    const someObject = store.pull(req, { name: 'SOME_OBJECT' })

    res.send(someObject);
    next();
}

```

### Store a JSON object

To place an object into the store, you can utilize `push` function. The function has the following signature.

`store.pull(req, { name: string, data: object})`

-   req, express Request object
-   name, a string that identifies your data within the store.
-   data, JSON object to place in the store

```javascript
const store = require('amn-store');

const myConnectMiddleware = (req, res, next) => {
    const myObject = { one: 'one', two: 'two' };
    // store data to Request with help of Amn Store
    store.push(req, { name: 'MY_OBJECT_NAME', data: myObject });
};
```

### Retrieve from store

There are two options on how to extract data from the store. Utilizing `pull` or `pop` functions.

```javascript
const store = require('amn-store');

const myConnectMiddleware = (req, res, next) => {
    // by default pull function will look into store to find and object with key 'MY_OBJECT_NAME'. In case object is not found, it throws and error.
    const myObject = store.pull(req, { name: 'MY_OBJECT_NAME' });
    // you can disable internal check by passing strick = false
    const myObject = store.pull(req, { name: 'MY_OBJECT_NAME', strict: false });
    // in case not suck object in store pull function return `undefined`. It is your responsibility to check whether an object exists.
    if (!myObject) {
        throw new Error('Object not found in store.');
    }
};
```

#### `pull` vs `pop`

`pull` and `pop` function are identical signature wise. `pop` function remove object from the store once you extract it.
