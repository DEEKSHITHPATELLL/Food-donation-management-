import React, { useState, useEffect, useRef } from "react";
import { Snackbar, Button, CircularProgress } from "@mui/material";
import "./RecipeGenerator.css";

const RecipeGenerator = () => {
    const [ingredients, setIngredients] = useState("");
    const [recipe, setRecipe] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [loadingImage, setLoadingImage] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const utteranceRef = useRef(null);

    const generateRecipe = async () => {
        setImageURL("");
        setRecipe("");
        stopSpeech();
        setOpenSnackbar(true);

        try {
            const response = await fetch("http://localhost:3000/generate-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients: ingredients.split(",") }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate recipe");
            }

            const data = await response.json();
            setRecipe(data.recipe);
            setOpenSnackbar(false);

            // Start speaking the recipe immediately after it is received
            startSpeech(data.recipe);

            generateRecipeImage(data.recipe);  // Pass clean recipe to image generation
        } catch (err) {
            console.error("Error generating recipe:", err);
            setOpenSnackbar(false);
        }
    };

    const generateRecipeImage = async (recipeDescription) => {
        setLoadingImage(true);

        try {
            const response = await fetch("http://localhost:3000/generate-recipe-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: recipeDescription, gradient: true }),  // Pass gradient flag
            });

            if (!response.ok) {
                throw new Error("Failed to generate recipe image");
            }

            const data = await response.json();
            setImageURL(data.imageURL);
        } catch (err) {
            console.error("Error generating recipe image:", err);
            setImageURL("");
        } finally {
            setLoadingImage(false);
        }
    };

    // Text-to-Speech Functionality
    const startSpeech = (recipeText) => {
        if (recipeText) {
            const utterance = new SpeechSynthesisUtterance(recipeText);
            utterance.voice = window.speechSynthesis
                .getVoices()
                .find((voice) => voice.name.includes("Female") || voice.name.includes("Google UK English Female"));
            utterance.rate = 1;
            utterance.onend = () => {
                setSpeaking(false);
            };
            utteranceRef.current = utterance;
            setSpeaking(true);
            setPaused(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const pauseSpeech = () => {
        if (speaking && !paused) {
            window.speechSynthesis.pause();
            setPaused(true);
        }
    };

    const resumeSpeech = () => {
        if (speaking && paused) {
            window.speechSynthesis.resume();
            setPaused(false);
        }
    };

    const stopSpeech = () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            setPaused(false);
        }
    };

    return (
        <div className="container">
            <h1 className="heading">Recipe Generator</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients, separated by commas"
                    className="input"
                />
                <Button
                    onClick={generateRecipe}
                    variant="contained"
                    className="button"
                >
                    Generate Recipe
                </Button>
            </div>

            <Snackbar
                open={openSnackbar}
                message="Generating Recipe..."
                autoHideDuration={2000}
                className="snackbar"
            />

            <div className="recipe-container">
                {recipe && (
                    <>
                        <h2 className="recipe-title">Generated Recipe:</h2>
                        <div
                            className="recipe-text"
                            dangerouslySetInnerHTML={{ __html: recipe }}
                        />
                        
                        <div className="tts-buttons">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => startSpeech(recipe)}  // Ensure startSpeech is triggered with the cleaned recipe
                                disabled={speaking}
                                className="tts-button"
                            >
                                Play
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={pauseSpeech}
                                disabled={!speaking || paused}
                                className="tts-button"
                            >
                                Pause
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={resumeSpeech}
                                disabled={!speaking || !paused}
                                className="tts-button"
                            >
                                Resume
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={stopSpeech}
                                disabled={!speaking}
                                className="tts-button"
                            >
                                Stop
                            </Button>
                        </div>
                    </>
                )}

                {loadingImage && <CircularProgress className="loader" />}
                {imageURL && (
                    <div className="image-container">
                        <h3 className="image-title">Recipe Image:</h3>
                        <img
                            src={imageURL}
                            alt="Generated Recipe"
                            className="image"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeGenerator;
