"use client"

import { Fragment } from "react"
import Image from "next/image"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { useInfiniteQuery } from "@tanstack/react-query"
import { intlFormatDistance } from "date-fns"

import type { Recipe } from "./actions"
import { getFeedPage } from "./actions"

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
    queryFn: async ({ pageParam }) => await getFeedPage(pageParam),
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
              <RecipeFeedItem key={recipe.id} recipe={recipe} />
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

function RecipeFeedItem({
  recipe: { title, user, createdAt, media },
}: {
  recipe: Recipe
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center px-4 py-3.5 sm:px-0">
        <div>
          <h3 className="font-serif text-xl font-semibold leading-none">
            {title}
          </h3>
        </div>
      </div>
      <AspectRatio ratio={1} className="overflow-hidden sm:rounded-sm">
        <Image
          src={media.url}
          alt={title}
          sizes="(min-width: 640px) 448px, 100vw"
          placeholder="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          fill
        />
      </AspectRatio>
      <div className="px-4 sm:px-0">
        <div className="flex flex-col">
          <div className="mt-2">
            <p className="text-sm">
              Publicado por{" "}
              <span className="font-semibold">
                {user?.username ?? "[USUARIO ELIMINADO]"}
              </span>
            </p>
            <p className="text-sm" suppressHydrationWarning>
              {intlFormatDistance(createdAt, new Date(), {
                locale: "es",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
