import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { AuthOptions } from "next-auth"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ""
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ""

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET
    })
  ]
}

export default authOptions
