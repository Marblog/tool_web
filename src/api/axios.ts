
import axios, { AxiosInstance } from 'axios';

const ajax: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 50000,
});

export default ajax;
