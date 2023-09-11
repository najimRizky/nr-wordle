import Link from "next/link"

const Footer = () => {
  return (
    <div className={`flex justify-center w-full pb-3`}>
      <p>
        <span
          className="font-extralight"
        >
          Developed by &nbsp;
        </span>
        <Link
          href="https://najim-rizky.com"
          target="_blank"
          className="font-bold hover:underline"
        >
          najimRizky
        </Link>
      </p>
    </div>
  )
}

export default Footer