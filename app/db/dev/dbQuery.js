<<<<<<< HEAD
import pool from './pool'
export default {
    /**
     * DB Query
     * @param {object} req
     * @param {object} res
     * @returns {object} object
     */
    query(quertText, params){
        return new Promise((resolve, reject)=> {
            pool.query(quertText, params)
            .then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
                reject(err);
            });
        });
    },
=======
import pool from './pool'
export default{
    /**
     * DB Query
     * @param {object} req
     * @param {object} res
     * @returns {object} object
     */
    query(quertText, params){
        return new Promise((resolve, reject)=> {
            pool.query(quertText, params)
            .then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
                reject(err);
            });
        });
    },
>>>>>>> e6eac218a2dbba879bba3a6055ac30b3df534946
};