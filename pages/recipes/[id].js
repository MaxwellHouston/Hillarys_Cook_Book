import { Divider } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Directions from "../../components/Recipes/Directions";
import Ingredients from "../../components/Recipes/Ingredients";
import RecipePageSkeleton from "../../components/Recipes/RecipePageSkeleton";
import { getImageById, getRecipeById } from "../../utilities/db";

export default function Recipe() {
    const router = useRouter();
    const [recipe, setRecipe] = useState(null);
    const [imgSrc, setImgSrc] = useState('');

    const loadRecipe = useCallback(async () => {
        let recipeId = router.query;
        try {
            const data = await getRecipeById(recipeId);
            const imageUrl = await getImageById(recipeId);
            if(imageUrl) setImgSrc(imageUrl);
            setRecipe(data);
        } catch (error) {
            console.log(error)
        }
    }, [router.query]);

    useEffect(() => {
       loadRecipe();
    },[loadRecipe]);

    return (
        <div >
        {!recipe ? <RecipePageSkeleton /> : (
            <div className="w-full border-2 p-10 mt-4 mb-8 shadow-2xl">
                <h1 className="font-bold text-5xl text-center mb-5">{recipe ? recipe.name : 'Loading...'}</h1>
                <Image src={imgSrc} alt='recipe photo' priority width={500} height={500} className='w-full' />
                <hr className="my-10 border-slate-500" variant="middle" />
                <h2 className="text-center font-bold text-2xl my-3 underline">Ingredients</h2>
                <Ingredients ingredients={recipe && recipe.ingredientsList} />
                <hr className="my-10 border-slate-500" variant="middle" />
                <h2 className="text-center font-bold text-2xl my-3 underline">Directions</h2>
                <Directions directions={recipe && recipe.directionsList} />
            </div>
        )}
        </div>
    )


}