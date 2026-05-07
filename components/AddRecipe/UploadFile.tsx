import Image from 'next/image'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

interface UploadFileProps {
  onUploaded: (url: string | null) => void;
}

export default function UploadFile({ onUploaded }: UploadFileProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const handleFileInput = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed')
      onUploaded(data.secure_url)
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
      setPreview(null)
      onUploaded(null)
    } finally {
      setUploading(false)
    }
  }

  const clearFile = (e: MouseEvent) => {
    e.preventDefault()
    onUploaded(null)
    setPreview(null)
    setError(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <div className="my-8 flex flex-wrap items-center gap-4">
      <h2 className="font-bold">Upload photo:</h2>
      <div className="flex items-center gap-2">
        <input
          className="w-3/4"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          ref={fileInput}
          disabled={uploading}
        />
        <button onClick={clearFile} disabled={uploading}>
          <IoCloseSharp />
        </button>
      </div>
      {uploading && <span className="text-sm text-slate-500">Uploading…</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
      {preview && (
        <Image src={preview} alt="image preview" width={50} height={50} className="rounded" />
      )}
      <p className="hidden md:block w-1/4 text-xs text-slate-500">
        <em>Images with similar height &amp; width appear better in book.</em>
      </p>
    </div>
  )
}
