import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function useTranslate({ sourceText, selectedLanguage }) {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    console.log("Use Effect");
    const handleTranslate = async (sourceText) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `
                    You will be provided with a sentence.The senetence - ${sourceText}. You are required to do following stuff
                    - Detect the language of the sentence
                    - Translate the sentence into ${selectedLanguage}
                    do not return anything other than translated sentence.                    
                    `,
              temperature: 0,
            },
          ],
        });
        const data = response.choices[0].message.content;
        setTargetText(data);
      } catch (error) {
        console.error("Error translating text:", error);
      }
    };
    if (sourceText.trim()) {
      const timeOutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [sourceText, selectedLanguage]);
  return targetText;
}

export default useTranslate;
