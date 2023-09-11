import { NextRequest, NextResponse, } from "next/server"
import dictionary from "@/data/dictionary.json"
import Cryptr from "cryptr";
import baseCookie from "@/config/baseCookie";

export const GET = async (req: NextRequest) => {
  const length = Number(req.nextUrl.searchParams.get("length")) || 0

  if (length < 4 || length > 11) {
    return new Response("Length must be between 4 and 11", {
      status: 400,
    })
  }

  const filteredDictionary = dictionary.filter((word) => word.length === length)
  const randomIndex = Math.floor(Math.random() * filteredDictionary.length)

  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""
  const word = filteredDictionary[randomIndex]

  const cryptr = new Cryptr(ENCRYPTION_KEY);
  const encryptedString = cryptr.encrypt(word);

  const response = NextResponse.json({
    message: "ok"
  })

  response.cookies.set("word", encryptedString, baseCookie)
  response.cookies.set("tries", "0", baseCookie)

  return response
}