import { SiCss3, SiGo, SiHtml5, SiJavascript, SiJson, SiMarkdown, SiPython, SiRust, SiTypescript, SiYaml, SiDocker, SiPrisma } from "react-icons/si";
import { BiSolidImage } from "react-icons/bi";

import { File } from "lucide-react";


interface IconObject {
  extionsions: string[]
  name: string
  icon: JSX.Element,
}

const icons: IconObject[] = [
  {
    name: "Rust",
    extionsions: ["rs"],
    icon: <SiRust />
  },
  {
    name: "Javascript",
    extionsions: ["js", "jsx", "mjs", "cjs"],
    icon: <SiJavascript />
  },
  {
    name: "Typescript",
    extionsions: ["ts", "tsx"],
    icon: <SiTypescript />
  },
  {
    name: "Go",
    extionsions: ["go"],
    icon: <SiGo />
  },
  {
    name: "Python",
    extionsions: ["py"],
    icon: <SiPython />
  },
  {
    name: "Markdown",
    extionsions: ["md", "mdx"],
    icon: <SiMarkdown />
  },
  {
    name: "HTML",
    extionsions: ["html", "htm", "shtml", "xhtml", "phtml"],
    icon: <SiHtml5 />
  },
  {
    name: "CSS",
    extionsions: ["css", "scss", "sass", "less"],
    icon: <SiCss3 />
  },
  {
    name: "JSON",
    extionsions: ["json", "json5", "jsonb", "jsonc"],
    icon: <SiJson />
  },
  {
    name: "YAML",
    extionsions: ["yaml", "yml"],
    icon: <SiYaml />
  },
  {
    name: "Docker",
    extionsions: ["dockerfile", "Dockerfile", "docker-compose.yml", "docker-compose.yaml", "compose.yaml", "compose.yml", ".dockerignore"],
    icon: <SiDocker />
  },
  {
    name: "Image",
    extionsions: ["png", "jpg", "jpeg", "gif", "webp", "svg", "tiff", "bmp"],
    icon: <BiSolidImage />
  },
  {
    name: "Prisma",
    extionsions: ["prisma"],
    icon: <SiPrisma />
  }
]

export default function IconProvider({ ext }: { ext: string }) {
  const icon = icons.find(i => i.extionsions.includes(ext))

  if (!icon) {
    return <File size={24} />
  }

  return icon.icon
}
