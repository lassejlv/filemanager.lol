import { SiCss3, SiGo, SiHtml5, SiJavascript, SiJson, SiMarkdown, SiPython, SiRust, SiTypescript } from "react-icons/si";
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
  }
]

export default function IconProvider({ ext }: { ext: string }) {
  const icon = icons.find(i => i.extionsions.includes(ext))

  if (!icon) {
    return <File size={24} />
  }

  return icon.icon
}
