import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';

import {
    hashPassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    generateUserToken,
} from '../helpers/validations';

import{
    errorMessage, successMessage, status,
} from '../helpers/status';
import { compareSync } from 'bcryptjs';

/**
 * create A Admin
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createAdmin = async (req, res)=>{
    const{
        email, first_name, last_name, password,
    } = req.body;

    const {is_Admin} = req.user;
    const isAdmin = true;
    const created_on = moment(new Date());

    if (!is_admin === false){
        errorMessage.error = 'Sorry you are unauthorized to create an admin';
        return res.status(status.bad).send(errorMessage);
    }
    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
        errorMessage.error = 'Email, password, first name and last name field cannot be empty';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail (email)){
        errorMessage.error = 'Please enter an valid enmail';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)){
        errorMessage.error = 'Password must more than 6 digits'
        return res.status(status.bad).send(errorMessage)
    }
    const hashedpassword = hashPassword(password);
    const createUserQuery = `INSERT INTO
    users(email, first_name, last_name, password, is_admin, created_on)
        VALUES($1, $2, $3, $4, $5, $6)
        returning *`;
const values = [
    email,
    first_name,
    last_name,
    password,
    is_admin,
    created_on,
];
try{
    const {rows} = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows [0];
    delete dbResponse.password;
    const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name)
successMessage.data = dbResponse;
successMessage.data.token = token;
return res.status(status.created).send(successMessage);
} catch (error){
    if (error.routine === '_bt_check_unique'){
errorMessage.error = 'Admin with that EMAIL alerady exist';
return res.status(status.conflict).send(errorMessage);
    }
}
};


