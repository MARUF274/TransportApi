import pool from './pool'
export default {
    /**
     * DB Query
     * @param {object} req
     * @param {object} res
     * @returns {object} object
     */
    query(quertText, params){
return pool.query(quertText, params)
    },
};