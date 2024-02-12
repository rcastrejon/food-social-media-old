import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { getFeedPage } from "./actions"
import FeedList from "./feed-list"

export default async function Page() {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["recipes"],
    queryFn: async ({ pageParam }) => await getFeedPage(pageParam),
    initialPageParam: 1,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedList />
    </HydrationBoundary>
  )
}
