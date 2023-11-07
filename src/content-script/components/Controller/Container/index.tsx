import "./style.css"

type Props = {
  children: React.ReactNode
  buttons?: React.ReactNode
  dragging?: boolean
}

export default function Container({ children, buttons, dragging }: Props) {
  return (
    <div className="container">
      <div
        className="content"
        style={dragging ? { background: "#202020e1" } : undefined}
      >
        <div
          className="content-inner"
          style={dragging ? { opacity: 1 } : undefined}
        >
          {children}
        </div>
      </div>
      {buttons && <div className="buttons">{buttons}</div>}
    </div>
  )
}
