"use client"

import { forwardRef, Fragment } from "react"
import Image from "next/image"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { useInfiniteQuery } from "@tanstack/react-query"
import { intlFormatDistance } from "date-fns"

import { getFeed } from "./actions"

export default function FeedList() {
  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["recipes"],
    queryFn: async ({ pageParam }) => {
      return await getFeed(pageParam)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  })

  if (error) {
    return <div>error</div>
  }
  if (data) {
    return (
      <div className="sm:m-auto sm:max-w-md">
        {data.pages.map((page, key) => (
          <Fragment key={key}>
            {page.rows.map((recipe) => (
              <Fragment key={recipe.id}>
                <RecipeCard>
                  <RecipeCardHeader>
                    <div>
                      <h3 className="font-serif text-xl font-semibold leading-none">
                        {recipe.title}
                      </h3>
                    </div>
                  </RecipeCardHeader>
                  <AspectRatio
                    ratio={1}
                    className="overflow-hidden sm:rounded-sm"
                  >
                    <Image
                      className="object-cover"
                      src={recipe.media.url}
                      alt={recipe.title}
                      fill
                      sizes="(min-width: 640px) 448px, 100vw"
                      priority
                    />
                  </AspectRatio>
                  <RecipeCardFooter>
                    <div className="mt-2">
                      <p className="text-sm">
                        Publicado por{" "}
                        <span className="font-semibold">
                          {recipe.user?.username ?? "[USUARIO ELIMINADO]"}
                        </span>
                      </p>
                      <p className="text-sm" suppressHydrationWarning>
                        {intlFormatDistance(recipe.createdAt, new Date(), {
                          locale: "es",
                        })}
                      </p>
                    </div>
                  </RecipeCardFooter>
                </RecipeCard>
              </Fragment>
            ))}
          </Fragment>
        ))}
        <div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
          </button>
        </div>
        <div>
          {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
        </div>
      </div>
    )
  }
}

const RecipeCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div className="flex flex-col" ref={ref} {...props} />)
RecipeCard.displayName = "RecipeCard"

const RecipeCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div className="flex items-center px-4 py-3.5 sm:px-0" ref={ref} {...props} />
))
RecipeCardHeader.displayName = "RecipeCardHeader"

const RecipeCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div className="px-4 sm:px-0">
    <div className="flex flex-col" ref={ref} {...props} />
  </div>
))
RecipeCardFooter.displayName = "RecipeCardFooter"
