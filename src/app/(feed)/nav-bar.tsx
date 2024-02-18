"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

const config = [
  {
    title: "Inicio",
    icon: "i-[heroicons--home]",
    iconSolid: "i-[heroicons--home-solid]",
    href: "/",
  },
  {
    title: "Buscar",
    icon: "i-[heroicons--magnifying-glass]",
    iconSolid: "i-[heroicons--magnifying-glass-solid]",
    href: "/search",
  },
  {
    title: "Perfil",
    icon: "i-[heroicons--user]",
    iconSolid: "i-[heroicons--user-solid]",
    href: "/profile",
  },
  {
    title: "Nueva receta",
    icon: "i-[heroicons--pencil-square]",
    iconSolid: "i-[heroicons--pencil-square-solid]",
    href: "/new",
  },
]

export function NavBar() {
  const pathName = usePathname()

  return (
    <nav className="grid w-full grid-cols-4 items-center">
      {config.map((item) => (
        <Button
          key={item.title}
          variant="ghost"
          className="mx-0.5 my-1 h-full px-8 py-5 hover:bg-accent/50 hover:backdrop-blur-xl"
          asChild
        >
          <Link href={item.href} aria-label={item.title}>
            <span
              className={cn(
                "h-6 w-6",
                pathName === item.href ? item.iconSolid : item.icon,
              )}
            />
          </Link>
        </Button>
      ))}
    </nav>
  )
}
