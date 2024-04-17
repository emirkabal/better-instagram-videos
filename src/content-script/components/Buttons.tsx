import "./Controller/style.css"
import { useEffect, useState } from "react"

export default function Buttons() {
  const id = Math.random().toString(36).substring(7)
  const [autoskip, setAutoskip] = useState(false)

  useEffect(() => {
    const autoskip = localStorage.getItem("bigv-autoskip")
    if (autoskip) setAutoskip(autoskip === "true")
  }, [])

  useEffect(() => {
    localStorage.setItem("bigv-autoskip", autoskip.toString())
  }, [autoskip])

  return (
    <>
      <div className="bigv-buttons">
        <label htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={autoskip}
            onChange={() => setAutoskip(!autoskip)}
          />
          <span className="bigv-slider"></span>
          Autoskip
        </label>
      </div>
    </>
  )
}
