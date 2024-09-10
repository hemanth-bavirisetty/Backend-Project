# DB

- MongoDB Atlas
    - create an org , cluster and config
    - get connection string
    - store connection string in ./env


-  to use import module (es module) syntax with dotenv package

step-1

```js
import dotenv from 'dotenv'

dotenv.config({
    path:'./env'
})
```

step-2

```json
"scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```
