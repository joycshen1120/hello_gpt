//ask what mood
//ask if any favored cuisine
//time for cooking
//ask any food to avoid or allergies

import { gptPrompt } from "../shared/openai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  say("hello, Chef!");

  let satisfaction = false;
  const mood = await ask("what is your mood today?");
  const cuisine = await ask("Do you have a favored cuisine? If yes, what?");
  const time = await ask("How long do you have for cooking?");
  const avoidFood = await ask("Any food you want to avoid or any allergy?");

  const recipeString = await gptPrompt(
    `Express empathy toward the mood. Generate a creative, personalized recipe that fit the ${mood}. If the user specified a ${cuisine}, do a recipe on the cuisine. 
    The complexity of the recipe should be based on ${time}. Avoid any thing specified in ${avoidFood}, if any.
    Be clear and concise, don't be wordy when describing the steps`,
    { max_tokens: 500, temperature: 0.75 },
  );

  say(recipeString);
  say("");

  let followUp = await ask("Are you satisfied with the recipe?");

  while (followUp.toLowerCase() !== "yes") {
    const change = await ask(
      "what aspects of the recipe do you want to change?",
    );

    const recipeString = await gptPrompt(
      `Incorporate changes from ${change} and generate revised recipe. Pay special attention to if there is any change in the mood, cuisine, ingredients, or time for cooking. Be clear and empathetic, don't be wordy when describing the steps`,
      { max_tokens: 500, temperature: 0.75 },
    );

    say(recipeString);
    say("");

    followUp = await ask("Are you satisfied with the recipe?");
  }

  if (followUp.toLowerCase() === "yes") {
    //add ambience
    satisfaction = true;
    say("Let's add some ambience to the feast");
    const ambience = await gptPrompt(
      `Based on the ${recipeString}, generate a short instruction on the set-up of the feast. Suggest a music or TV show or Movie the user can listen to or watch when eating (1-2 sentences). Suggest the utensil and tableware choice to match the food, just focus on color, shape, and pattern (1-2 sentences). Be concise and avoid being wordy in the description. Wish the user an enjoyable meal in a tone that fit their ${mood} at the end.`,
      { max_tokens: 180, temperature: 0.9 },
    );

    say(ambience);
    say("");
  }
}
