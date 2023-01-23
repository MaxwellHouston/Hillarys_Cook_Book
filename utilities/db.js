import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, list, ref } from "firebase/storage";
import { db, storage } from "./firebase";

export const getRecipeById = async ({id}) => {
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

export const getImageById = async ({id}) => {
    const imageRef = ref(storage, `recipe-images/`);
    const docs = await list(imageRef);
    const imgDoc = docs.items.filter(item => item.name === id);
    if(imgDoc.length !== 0){
        return await getDownloadURL(imgDoc[0]);
    } else {
        return false
    }
}