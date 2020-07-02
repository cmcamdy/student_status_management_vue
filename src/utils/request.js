import axios from 'axios';
let base_url = "http://localhost:8081"
export function get(url,params){
    return axios.get(base_url+url,{params});
}
export function post(url,data){
    return axios.post(base_url+url,data,{
        headers:{
           'content-type': 'application/json',
        }
    });
}
export function del(url){
    return axios.delete(base_url+url);
}
export function put(url,data){
    return axios.put(base_url+url,data);
}

const instance = axios.create({
    baseURL: 'http://localhost:8081/',
    timeout: 3*1000,
    headers: {'X-Custom-Header': 'foobar'}
  });
