import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

export default function UploadFile({ upload, file }) {
  const [imgSrc, setImageSrc] = useState(null)
  const [sizeAlert, setSizeAlert] = useState(false)

  const fileInput = useRef(null)

  const handleFileInput = ({ target }) => {
    upload(target.files[0])
  }

  const clearFile = (e) => {
    e.preventDefault()
    upload(null)
    fileInput.current.value = null
  }

  useEffect(() => {
    if (file) {
      setImageSrc(URL.createObjectURL(file))
    } else {
      fileInput.current.value = null
      setImageSrc(null)
      setSizeAlert(false)
    }
  }, [file])

  return (
    <div className="my-8 flex items-center">
      <h2 className="mr-5 font-bold">Upload photo:</h2>
      <div className="flex items-center">
        <input
          className="w-3/4"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          ref={fileInput}
        />
        <button
          onClick={(e) => fileInput.current && fileInput.current.click()}
        />
        <button onClick={clearFile}>
          <IoCloseSharp />
        </button>
      </div>
      {imgSrc && (
        <Image src={imgSrc} alt="image preview" width={50} height={50} />
      )}
      <p className={`w-1/3 pl-5 text-xs`}>
        <em>Images with similar height & width appear better in book.</em>
      </p>
    </div>
  )
}
