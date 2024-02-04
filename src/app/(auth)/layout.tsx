import Image from "next/image"

import cover from "./sandwich-cover.jpeg"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-row-reverse">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20">
        {children}
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={cover}
          alt="Un sándwich en una tabla de cortar con lechuga, tocino y rodajas de tomate."
          placeholder="blur"
          sizes="(min-width: 1024px) 100vw, 0px"
          fill
        />
      </div>
    </div>
  )
}