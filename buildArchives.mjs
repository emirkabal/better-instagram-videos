import path from "node:path"
import fs from "fs-extra"
import archiver from "archiver"
const dir = "build"

const version = process.env.npm_package_version || "0.0.0"

async function syncVersion() {
  const manifest = await fs.readJson("./src/manifest.json")
  manifest.version = version
  await fs.writeJson("./src/manifest.json", manifest, { spaces: 2 })
  console.info("Version synced ", version)
}

async function createArchive() {
  const name = `${dir}/better-instagram-videos-${version}.zip`
  const archive = archiver("zip", { zlib: { level: 9 } })
  const stream = fs.createWriteStream(name)

  archive.pipe(stream)

  const entries = await fs.readdir("dist")
  for (const entry of entries) {
    const stat = await fs.stat(path.join("dist", entry))
    if (stat.isDirectory()) archive.directory(path.join("dist", entry), entry)
    else archive.file(path.join("dist", entry), { name: entry })
  }

  console.info("Creating archive ", name)
  await archive.finalize()
}

async function build() {
  if (await fs.pathExists(dir)) {
    await fs.remove(dir)
  }
  await fs.mkdir(dir)

  await syncVersion()

  try {
    await createArchive()
  } catch (error) {
    console.error(error)
  }

  console.info("Build complete")
}

build()
