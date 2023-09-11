import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import StatusType from "@/types/StatusType";
import dictionary from "@/data/dictionary.json";
import baseCookie from "@/config/baseCookie";

export const POST = async (req: NextRequest) => {
  const { answer } = await req.json()

  if (!answer || answer.length < 4 || answer.length > 11) {
    return new Response("No answer found or invalid length", {
      status: 400,
    })
  }

  if (!isAnswerAvailable(answer)) {
    return new Response("Word is not available", {
      status: 400,
    })
  }

  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""
  const rawWord = req.cookies.get("word")?.value
  const tries = Number(req.cookies.get("tries")?.value) || 0

  if (!rawWord) {
    return new Response("No word found")
  }

  try {
    const cryptr = new Cryptr(ENCRYPTION_KEY);
    const word = cryptr.decrypt(rawWord);

    if (word.length !== answer.length) {
      throw new Error("Invalid word")
    }

    const result = determineResult(word, answer);

    const response =  NextResponse.json({
      result: result.data,
      isCorrect: result.isCorrect,
      word: (tries === 5 || result.isCorrect) ? word : undefined,
    })

    response.cookies.set("tries", String(tries + 1), baseCookie)

    return response
  } catch (error: any) {
    return new Response(error?.message || "Invalid word", {
      status: 400,
    })
  }
}

const determineResult = (word: string, answer: string) => {
  const wordArray = word.split('');
  const answerArray = answer.split('');
  const result: {
    character: string;
    status: StatusType
  }[] = [];

  answerArray.forEach((answerChar, index) => {
    const position = wordArray[index] === answerChar;
    const exist = wordArray.includes(answerChar);
    result.push({
      character: answerChar,
      status: exist ? (position ? 'correct' : 'almost') : 'wrong',
    });
  });

  return {
    data: result,
    isCorrect: result.every((item) => item.status === 'correct'),
  };
}

const isAnswerAvailable = (answer: string) => {
  return dictionary.includes(answer);
}