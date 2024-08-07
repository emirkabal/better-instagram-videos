import cn from "classnames"
import "./style.css"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"

type Props = {
  children: React.ReactNode
  buttons?: React.ReactNode
  dragging?: boolean
}

export default function Container({ children, buttons, dragging }: Props) {
  const [active, setActive] = useState(false)
  const debounceRef = useRef<ReturnType<typeof debounce> | null>(null)

  const handleMouseEnter = () => {
    if (debounceRef.current) {
      debounceRef.current.cancel()
    }
    setActive(true)
  }

  const debouncedHandleMouseLeave = useCallback(
    debounce(() => {
      setActive(false)
    }, 1300),
    []
  )

  useEffect(() => {
    debounceRef.current = debouncedHandleMouseLeave
    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel()
      }
    }
  }, [debouncedHandleMouseLeave])

  return (
    <div
      className="container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={debouncedHandleMouseLeave}
    >
      <div
        className={cn("content", {
          active: dragging || active
        })}
      >
        <div
          className="content-inner"
          style={dragging || active ? { opacity: 1 } : undefined}
        >
          {children}
        </div>
      </div>
      {buttons && <div className="buttons">{buttons}</div>}
    </div>
  )
}
