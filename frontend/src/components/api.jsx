//Connecting the backend with the frontend 

import axios from 'axios'

const instance = axios.create({
    // baseURL : "http://localhost:4000",
    baseURL : "http://3.95.226.252:4000",
    withcredentials : true,
});

export default instance;