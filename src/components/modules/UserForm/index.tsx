import Modal from "@/components/base/Modal"
import { useState } from "react"
import { countries } from "country-flag-icons"
import { getName } from "country-list"
import axios from "axios"

const countryList = countries.filter((countryCode: any) => getName(countryCode)).map((countryCode: any) => {
  return {
    name: getName(countryCode),
    code: countryCode
  }
})

const UserForm = ({ data, onSuccess }: { data: { username: string, country: string }, onSuccess: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: data?.username || '',
    country: data?.country?.toUpperCase() || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<boolean>()

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await axios.put('/api/user', formData)

      setError(false)
      setLoading(false)
      setTimeout(() => {
        closeModal()
      }, 1000)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error: any) {
      console.log(error)
      setError(true)
    }
  }

  return (
    <>
      <button
        className="px-4 py-1 bg-slate-700 text-white rounded"
        onClick={openModal}
      >
        Edit Profile
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Profile"
      >
        {error === true && <p className="text-red-500">Something went wrong. Please check your data and try again.</p>}
        {error === false && <p className="text-green-500">Your profile has been updated.</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-2-gray-300 rounded-sm outline-none focus:border-gray-500 duration-300"
              required
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-bold mb-2">Country</label>
            <select
              className="w-full px-3 py-2 border border-2-gray-300 rounded-sm outline-none focus:border-gray-500 duration-300"
              required
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="" disabled>Select your country</option>
              {countryList.map((country: any) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-1 mr-2 bg-gray-300 text-black rounded hover:opacity-75 duration-300"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-slate-700 text-white rounded hover:opacity-75 duration-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default UserForm