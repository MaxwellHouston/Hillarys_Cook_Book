import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getAllRecipes, getRecipeById, tester } from "../../utilities/db";

export default function Recipe() {
    const router = useRouter();
    const [recipe, setRecipe] = useState([]);

    const test = async () => {
        console.log(await getAllRecipes())
    }

    const loadRecipe = useCallback(async () => {
        let recipeId = router.query;
        const data = await getRecipeById(recipeId);
        setRecipe(data);
    }, [router.query])

    useEffect(() => {
        loadRecipe()
    },[loadRecipe])

    return(
        <div>
            <button onClick={test}>Get</button>
        </div>
    )
}