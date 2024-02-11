import { gptPrompt } from "../shared/openai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  say("Hello, there!");

  const subject = await ask("What is a subject you want a joke on?");

  say("");

  const prompt =
    `The subject is ${subject}. Create a light-bulb joke on that subject. Be concise.`;

  const joke = await gptPrompt(prompt, { temperature: 0.8 });
  say(`"""\n${joke}\n"""`);
}
