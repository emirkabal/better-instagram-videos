import { useId } from "react"
import { useLocalStorage } from "usehooks-ts"

export default function Autoskip() {
  const id = useId()
  const [autoSkip, setAutoSkip] = useLocalStorage("bigv-autoskip", false)

  return (
    <div>
      <label htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={autoSkip}
          onChange={() => setAutoSkip(!autoSkip)}
        />
        <span className="bigv-slider"></span>
        <span>Autoskip</span>
      </label>
    </div>
  )
}
