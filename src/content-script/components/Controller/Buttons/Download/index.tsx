import "./style.css"
import DownloadIcon from "@/assets/icons/download.svg?react"

type Props = {
  igData: {
    id: string
    index?: number
  }
}

export default function DownloadButton({ igData }: Props) {
  const download = async () => {
    const url = `https://www.instagram.com/p/${igData.id}/?__a=1&__d=dis`
    const res = await fetch(url)
    const data = await res.json()

    const videoUrl =
      data.items[0].video_versions[0].url ||
      data.items[0].carousel_media[igData?.index ? igData?.index - 1 : 0]
        ?.video_versions[0]?.url

    const blob = await fetch(videoUrl).then((r) => r.blob())

    const urlBlob = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = urlBlob
    a.download = `${igData.id}.mp4`
    a.click()

    URL.revokeObjectURL(urlBlob)
  }

  return <DownloadIcon onClick={download} className="better-ig-download" />
}
