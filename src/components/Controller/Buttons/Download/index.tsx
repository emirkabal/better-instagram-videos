import DownloadIcon from "react:../../icons/download.svg"

import "./style.css"

import type { DownloadableMedia } from "~modules/Injector"

export default function DownloadButton({
  data,
  inside = false,
  label = true
}: {
  data: DownloadableMedia
  inside?: boolean
  label?: boolean
}) {
  const download = async () => {
    const url = `https://www.instagram.com/p/${data.id}/?__a=1&__d=dis`
    const res = await fetch(url)
    const body = await res.json()

    const index = data.index ? data.index - 1 : 0

    const videoUrl =
      body.items?.[0]?.video_versions?.[0]?.url ||
      body.items?.[0]?.carousel_media?.[index]?.video_versions?.[0]?.url

    const blob = await fetch(videoUrl).then((r) => r.blob())
    const urlBlob = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = urlBlob
    a.download = data.index ? `${data.id}_${data.index}.mp4` : `${data.id}.mp4`
    a.click()

    URL.revokeObjectURL(urlBlob)
  }

  return (
    <div
      role="button"
      onClick={download}
      className={inside ? "bigv-inside-download" : ""}>
      <DownloadIcon aria-label="Download" />
      {label && (
        <label htmlFor="download">
          {chrome.i18n.getMessage("downloadLabel")}
        </label>
      )}
    </div>
  )
}
