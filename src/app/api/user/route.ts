import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/database/connection";
import User from "@/database/model/User";
import { generateUsernameFromEmail } from "@/helper/string";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect()
    const session = await getServerSession()

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const stats = await req.json()

    const user = session?.user
    const findUser = await User.findOne({ email: user?.email })

    if (!findUser) {
      const newUser = new User({
        username: generateUsernameFromEmail(user?.email || ""),
        email: user?.email,
        country: null,
        stats: {
          wins: stats?.wins || 0,
          losses: stats?.losses || 0,
          total: stats?.total || 0,
          percentage: stats?.percentage || 0
        },
      })

      await newUser.save()
    }

    return NextResponse.json({
      message: "OK"
    })

  } catch (e) {
    return new Response("Something Went Wrong", { status: 500 })
  }
}