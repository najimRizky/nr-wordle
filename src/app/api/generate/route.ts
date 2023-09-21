import { NextRequest, NextResponse, } from "next/server"
import Cryptr from "cryptr";
import baseCookie from "@/config/baseCookie";
import dbConnect from "@/database/connection";
import Word from "@/database/model/Words";

export const GET = async (req: NextRequest) => {
  const length = Number(req.nextUrl.searchParams.get("length")) || 0

  if (length < 4 || length > 11) {
    return new Response("Length must be between 4 and 11", {
      status: 400,
    })
  }

  await dbConnect()

  const randomWord = await Word.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $strLenCP: "$word" }, length]
        }
      }
    },
    { $sample: { size: 1 } }
  ])

  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""
  const word = randomWord[0].word

  const cryptr = new Cryptr(ENCRYPTION_KEY);
  const encryptedString = cryptr.encrypt(word);

  const response = NextResponse.json({
    message: "ok"
  })

  response.cookies.set("word", encryptedString, baseCookie)
  response.cookies.set("tries", "0", baseCookie)

  return response
}