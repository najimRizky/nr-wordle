import dbConnect from "@/database/connection";
import User from "@/database/model/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect()
    const leaderboard = await User.aggregate([
      {
        $sort: {
          "stats.wins": - 1,
          "stats.losses": 1,
          "stats.total": 1,
          "stats.percentage": -1
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          stats: 1,
          country: 1,
          _id: 0
        }
      },
    ])

    const session = await getServerSession()

    if (!session?.user) {
    leaderboard.map(user => delete user.email)
      return NextResponse.json({
        data: {
          leaderboard: leaderboard.slice(0, 10),
        }
      })
    }

    const email = session?.user.email
    const userPosition = leaderboard.findIndex(user => user.email === email) + 1

    // Remove email from leaderboard data
    leaderboard.map(user => delete user.email)

    return NextResponse.json({
      data: {
        leaderboard: leaderboard.slice(0, 10),
        user: {
          position: userPosition,
          ...leaderboard[userPosition - 1]
        }
      },
    })
  } catch (error) {
    return new Response("Something Went Wrong", { status: 500 })
  }
}