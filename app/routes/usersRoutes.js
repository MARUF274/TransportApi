import express from 'express';

import { createUser, signinUser, searchFirstnameOrLastname } from '../controllers/usersControllers';

const router = express.Router();

// users Routes

router.post('/auth/signup', createUser);
router.post('/auth/signin', signinUser);
router.get('/users/first_name', searchFirstnameOrLastname);

export default router;