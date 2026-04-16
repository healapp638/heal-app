import { Metadata } from "next"

const baseUrl = "https://www.solariotech.com"

export function generateSEO({
  title,
  description,
  path = "",
  image = "/og-image.png",
  keywords = [],
}: {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
}): Metadata {

  const url = `${baseUrl}${path}`

  return {
    title: `${title} | Heal`,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Heal`,
      description,
      url,
      siteName: "Heal",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Heal`,
      description,
      images: [image],
    },
  }
}
