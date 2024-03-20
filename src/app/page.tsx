"use client";

import DarkMode from "@/components/DarkMode";
import SearchBar from "@/components/SearchBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Photo } from "@/types";
import { fetchImages } from "@/server";
import { useDebounce } from "use-debounce";
import Loading from "@/components/Loading";
import ImageCard from "@/components/ImageCard";

interface PhotoTypes {
  total: number;
  total_pages: number;
  results: Photo[];
}

export default function Home() {
  const sentinelRef = useRef(null);
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 300);

  const { isLoading, data, hasNextPage, fetchNextPage } = useInfiniteQuery<
    PhotoTypes,
    Error
  >({
    queryKey: ["images", value],
    queryFn: ({ pageParam = 1 }) => fetchImages(pageParam as number, value),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        fetchNextPage();
      }
    });
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);
  console.log("data", data);
  const photos = data?.pages.flatMap((page) => page.results);

  return (
    <div className="flex flex-col bg-white dark:text-white text-black dark:bg-black min-h-screen">
      <nav className="container py-5 flex justify-between items-center gap-10">
        <h2 className="text-transparent bg-clip-text font-bold text-3xl whitespace-nowrap bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
          Image Finder
        </h2>

        <SearchBar
          className="hidden md:flex"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DarkMode />
      </nav>
      <div className="md:hidden container">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <Loading />
      ) : photos && photos.length < 1 ? (
        <p className="mx-auto text-center text-gray-400 text-sm">
          No image found
        </p>
      ) : (
        <main className="columns-1 md:columns-2 xl:columns-4 gap-4 p-3">
          {photos?.map((photo, i) => (
            <ImageCard key={i} photo={photo} />
          ))}
        </main>
      )}
      {hasNextPage && (
        <div ref={sentinelRef} className="mx-auto">
          <Loading />
        </div>
      )}
    </div>
  );
}
