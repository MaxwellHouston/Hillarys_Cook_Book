import { useContext } from "react";
import AlertSnackbar from "./AlertSnackbar";
import { Favorites } from "../context/favoritesContext";


export default function FavoritesErrorAlert() {

    const {showError, closeError} = useContext(Favorites);

    return(
        <AlertSnackbar         
        status={showError}
        toggle={closeError}
        severity={'error'}
        message={'Unable to load favorites'} 
        />
    )
}