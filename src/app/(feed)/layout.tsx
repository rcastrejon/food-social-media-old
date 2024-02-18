import { NavBar } from "./nav-bar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="fixed left-0 right-0 top-0 z-[99] grid h-20 grid-cols-[1fr,_max-content,_1fr] grid-rows-[1fr] items-center bg-background/90 backdrop-blur-xl">
        <div />
        <div className="w-screen max-w-md">
          <NavBar />
        </div>
        <div />
      </header>
      <div>
        <div className="relative z-0 flex flex-col">
          <div className="relative top-16 flex min-h-[calc(100vh-5rem)] flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
