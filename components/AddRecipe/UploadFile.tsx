import Image from 'next/image'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

interface UploadFileProps {
  upload: (file: File | null) => void;
  file: File | null;
}

export default function UploadFile({ upload, file }: UploadFileProps) {
  const [imgSrc, setImageSrc] = useState<string | null>(null)
  const [sizeAlert, setSizeAlert] = useState(false)

  const fileInput = useRef<HTMLInputElement>(null)

  const handleFileInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
    upload(target.files![0])
  }

  const clearFile = (e: MouseEvent) => {
    e.preventDefault()
    upload(null)
    fileInput.current!.value = ''
  }

  useEffect(() => {
    if (file) {
      setImageSrc(URL.createObjectURL(file))
    } else {
      if (fileInput.current) fileInput.current.value = ''
      setImageSrc(null)
      setSizeAlert(false)
    }
  }, [file])

  return (
    <div className="my-8 flex items-center justify-between">
      <h2 className="mr-5 font-bold">Upload photo:</h2>
      <div className="flex items-center max-w-fit">
        <input
          className="w-3/4 mr-5"
          required
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          ref={fileInput}
        />
        <button
          //onClick={() => fileInput.current && fileInput.current.click()}
        />
        <button onClick={clearFile}>
          <IoCloseSharp />
        </button>
      </div>
      {imgSrc && (
        <Image src={imgSrc} alt="image preview" width={50} height={50} />
      )}
      <p className={`hidden md:block w-1/4 pl-5 text-xs`}>
        <em>Images with similar height & width appear better in book.</em>
      </p>
    </div>
  )
}
