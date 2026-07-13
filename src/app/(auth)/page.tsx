import { generateSEO } from '@/lib/seo'
import { ROUTES } from '@/routerKeys'
import Login from './login'

// Must never be statically prerendered/CDN-cached, or an already-authenticated
// user can be served this page without src/proxy.ts running its redirect.
export const dynamic = 'force-dynamic'

export const metadata = generateSEO({
  title: "Welcome",
  description: "Access your Heal securely.",
  path: ROUTES.WELCOME.WELCOME,
  keywords: ["Heal"],
  image: "/og-image.png",
})

export default function LoginPage() {
  console.log('process.env.npm_package_version', process.env.npm_package_version)
  return <Login />
}