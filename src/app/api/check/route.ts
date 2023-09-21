import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import StatusType from "@/types/StatusType";
import baseCookie from "@/config/baseCookie";
import dbConnect from "@/database/connection";
import { getServerSession } from "next-auth";
import User from "@/database/model/User";
import Word from "@/database/model/Words";

export const POST = async (req: NextRequest) => {
  const { answer } = await req.json()

  if (!answer || answer.length < 4 || answer.length > 11) {
    return new Response("No answer found or invalid length", {
      status: 400,
    })
  }

  const isValid = await isAnswerAvailable(answer)

  if (isValid) {
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
    const isCorrect = result.isCorrect;

    const session = await getServerSession()
    let userStats: any = null

    if (session?.user) {
      await dbConnect()
      const user = await User.findOne({ email: session.user.email })

      if (isCorrect) {
        await User.updateOne(
          { email: session.user.email },
          {
            $inc: { 'stats.wins': 1 },
            'stats.percentage': (user.stats.wins + 1) / (user.stats.total + 1),
            'stats.total': user.stats.wins + 1 + user.stats.losses,
          })
      } else if (tries === 5) {
        await User.updateOne(
          { email: session.user.email },
          {
            $inc: { 'stats.losses': 1 },
            'stats.percentage': (user.stats.wins) / (user.stats.total + 1),
            'stats.total': user.stats.wins + user.stats.losses + 1,
          })
      }

      userStats = await User.findOne({ email: session.user.email }, { stats: 1 })
    }

    const response = NextResponse.json({
      result: result.data,
      isCorrect: isCorrect,
      word: (tries === 5 || isCorrect) ? word : undefined,
      stats: userStats?.stats,

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

const isAnswerAvailable = async (answer: string) => {
  await dbConnect()
  const word = await Word.findOne({ word: answer })
  console.log(word)
  
  if (word) {
    return false
  }
  return true
}