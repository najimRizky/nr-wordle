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

    if (findUser) {
      return NextResponse.json({
        message: "OK",
        data: findUser
      })
    }

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

    return NextResponse.json({
      message: "OK",
      data: newUser
    })
  } catch (e) {
    return new Response("Something Went Wrong", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect()
    const session = await getServerSession()

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const email = session?.user?.email
    const findUser = await User.findOne({ email })

    if (!findUser) {
      return new Response("User Not Found", { status: 404 })
    }

    return NextResponse.json({
      message: "OK",
      data: findUser
    })
  } catch (e) {
    return new Response("Something Went Wrong", { status: 500 })
  }
}

export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect()
    const session = await getServerSession()

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const email = session?.user?.email
    const {
      username,
      country,
      stats,
    } = await req.json()

    const updatedData = await User.findOneAndUpdate({ email }, {
      username,
      country,
      stats,
    })

    if (!updatedData) {
      return new Response("User Not Found", { status: 404 })
    }

    return NextResponse.json({
      message: "OK",
    })
  } catch (e) {
    return new Response("Something Went Wrong", { status: 500 })
  }
}