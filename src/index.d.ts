/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  const content: string
  export default content
}
