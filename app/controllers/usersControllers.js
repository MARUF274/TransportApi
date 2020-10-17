import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';

import{
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    generateUserToken,
} from '../helpers/validations';

import{
    errorMessage, successMessage, status,
} from '../helpers/status';

/**Create a User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
*/
const createUser = async (req, res) =>{
    const{
        email, first_name, last_name, password,
    } = req.body;

    const created_on = moment(new Date());
    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)){
        errorMessage.error = 'You must fill all field!';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)){
        errorMessage.error = 'Input a valid email!'
        return res.status(status.bad).send(errorMessage);
    }
    if(!validatePassword(password)) {
        errorMessage.error = 'password must more than 6 digits'
        return res.status(status.bad).send(errorMessage);
    }
    const hashedPassword = hashPassword(password);
    const createUserQuery = `INSERT INTO 
    users(email, first_name, last_name, password, created_on)
    VALUES($1, $2, $3, $4, $5)
    returning *`;

    const values = [
        email,
        first_name,
        last_name,
        hashedPassword,
        created_on,
    ];
    try {
        const {rows}= await dbQuery.query(createUserQuery, values);
        const dbResponse = rows[0];
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage);
    } catch (error){
        if (error.routine === '_bt_check_unique'){
            errorMessage.error = 'User already exist'
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Operation not successful';
        return res.status(status.error).send(errorMessage);
    }
};
/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */

 const signinUser = async (req, res) =>{
     const { email, password } = req.body;
     if(isEmpty(email) ||isEmpty(password)){
         errorMessage.error = 'Email or password is missing';
         return res.status(status.bad).send(errorMessage)
     }
     const signinUserQuery = 'SELECT * FROM users WHERE email = $1';
     try{
         const {rows} =await dbQuery.query(signinUserQuery, [email]);
         const dbResponse = rows[0];
         if(!dbResponse){
             errorMessage.error = 'Users ith this email does not exist'
             return res.status(status.bad).send(errorMessage)
         }
         if(!comparePassword(dbResponse.password, password)){
             errorMessage.error = 'password incorrect!'
             return res.status(status.bad).send(errorMessage)
         }
         const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
         delete dbResponse.password;
         successMessage.data = dbResponse;
         successMessage.data.token = token;
         return res.status(status.success).send(successMessage);
     } catch(error){
         errorMessage.error = 'Operation not successful'
         return res.status(status.error).send(errorMessage);
     }
 };

 /**
 * @param {Object} req
 * @param {Object} res
 * @returns return firstname and Lastname
 */ 

const searchFirstnameOrLastname = async (req, res) => {
    const { first_name, last_name } = req.query;
    const searchQuery = 'SELECT * from users WHERE first_name =$1 OR last_name =$2 ORDER BY id DESC';
    try {
      const { rows } = await dbQuery.query(searchQuery, [first_name, last_name]);
      const dbResponse = rows;
      if (!dbResponse[0]) {
        errorMessage.error = 'No user with such names';
        return res.status(status.notfound).send(errorMessage);
      }
      successMessage.data = dbResponse;
      return res.status(status.success).send(successMessage);
    }
    catch (error) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);

    }
  };

 export{
     createUser,
     signinUser,
     searchFirstnameOrLastname,
 };