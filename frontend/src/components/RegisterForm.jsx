import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../src/feature/auth/authSlice';
import { Button, FormInput, FormLabel } from '../components/shared';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { isValidEmail } from '../utils/index';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      enqueueSnackbar('Please fill all the fields!', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }

    if (!isValidEmail(email)) {
      enqueueSnackbar('Please enter a valid email-id!', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }

    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then((response) => {
        enqueueSnackbar(response.message, {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        navigate('/');
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      })
      .finally(() => {
        setName('');
        setEmail('');
        setPassword('');
      });
  };

  return (
    <div className="max-w-sm p-4 rounded-lg sm:p-6 md:p-8 bg-black-700 w-[100%]">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h5 className="text-xl font-medium text-white text-center">Create an Account</h5>
        <div>
          <FormLabel htmlFor="name" labelHeading="Your name" />
          <FormInput
            type="text"
            name="name"
            id="name"
            value={name}
            setState={setName}
           
            required
          />
        </div>
        <div>
          <FormLabel htmlFor="email" labelHeading="Your email" />
          <FormInput
            type="email"
            name="email"
            id="email"
            value={email}
            setState={setEmail}
           
            required
          />
        </div>
        <div>
          <FormLabel htmlFor="password" labelHeading="Your password" />
          <FormInput
            type="password"
            name="password"
            id="password"
            value={password}
            setState={setPassword}
         
            required
          />
        </div>

        <Button content="Create your account" type="submit" isLoading={loading} />
        <div className="text-sm font-medium text-gray-300">
          Already registered?
          <Link to="/" className="hover:underline text-indigo-500 ml-1">Sign in</Link>
        </div>
      </form>
      {error && <p className="text-red-500 text-center mt-2">{error.message}</p>}
    </div>
  );
};

export default RegisterForm;
