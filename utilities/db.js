import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getRecipeById = async ({id}) => {
    console.log(id)
    const docRef = doc(db, 'recipes', id);
    const snapShot = await getDoc(docRef);
    return snapShot.data();
}

export const getAllRecipes = async () => {
    const collectionRef = collection(db, 'recipes');
    const snapshots = await getDocs(collectionRef);
    const docs = snapshots.docs.map(doc => ({...doc.data(), newId: doc.id}));
    return docs;
}