import { auth, db } from '../utilities/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AddForm from '../components/AddRecipe/AddForm';

export default function Add() {

    return(
        <div>
            <h1>Add Recipe</h1>
            <AddForm />
        </div>
    )
}

