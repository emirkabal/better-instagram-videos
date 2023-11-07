import "./style.css"
import VolumeIcon from "@/assets/icons/volume.svg?react"
import VolumeMutedIcon from "@/assets/icons/volume-off.svg?react"

type Props = {
  muted: boolean
  onChange: (muted: boolean) => void
}

export default function VolumeButton({ muted, onChange }: Props) {
  return (
    <div
      className="better-ig-volume-button"
      onClick={() => {
        onChange(!muted)
      }}
    >
      {muted ? <VolumeMutedIcon /> : <VolumeIcon />}
    </div>
  )
}
