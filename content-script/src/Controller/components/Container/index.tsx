/// <reference types="chrome" />

import "./style.css";

type Props = {
  children: React.ReactNode;
  outside?: React.ReactNode;
  dragging?: boolean;
};

export default function Container({ children, outside, dragging }: Props) {
  return (
    <>
      {outside}
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
      </div>
    </>
  );
}
