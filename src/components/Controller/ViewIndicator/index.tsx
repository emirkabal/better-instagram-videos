import "./style.css"

interface Props {
  current: number
  total: number
}

export default function ViewIndicator({ total, current }: Props) {
  return (
    <div className="bigv-view-indicator">
      <span>{current}</span>
      <span> / </span>
      <span>{total}</span>
    </div>
  )
}
