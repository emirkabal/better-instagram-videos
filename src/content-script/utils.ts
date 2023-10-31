export const getImage = (url: string) => {
  return chrome?.runtime?.getURL(url) || url
}
