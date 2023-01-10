import { useRef } from "react";

export default function UploadFile({upload}) {
    const fileInput = useRef(null);

    const handleFileInput = ({target}) => {
        upload(target.files[0])
    }
    return (
        <div className="flex my-5 space-x-5">
            <p>Upload photo for recipe:</p>
            <input type="file" onChange={handleFileInput} />
            <button onClick={e => fileInput.current && fileInput.current.click()} />
        </div>
    )
}