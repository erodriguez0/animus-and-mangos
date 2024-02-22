"use client"

import { Anime, Character, Manga } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import debounce from "lodash.debounce"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"

import { useOnClickOutside } from "@/hooks/use-on-click-outside"

import { SearchMode } from "@/types/custom"

interface SearchProps {
  onClick?: (item: Anime | Manga | Character, mode: SearchMode) => void
  mode: SearchMode | "all"
  disabled?: boolean
}

const Search = ({ onClick, mode, disabled }: SearchProps) => {
  const [input, setInput] = useState<string>("")
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput("")
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: results,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return { anime: [], manga: [], characters: [] }

      const res = await fetch(`/api/search?mode=${mode}&q=${input}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        return { anime: [], manga: [], characters: [] }
      }

      return (await res.json()) as {
        anime: Anime[]
        manga: Manga[]
        characters: Character[]
      }
    },
    queryKey: ["search-query"],
    enabled: false,
  })

  useEffect(() => {
    setInput("")
  }, [pathname])

  const handleOnClick = (item: Anime | Manga | Character) => {
    if (onClick && mode !== "all") {
      onClick(item, mode)
    } else {
      router.push(`/${mode}/${item.id}`)
      router.refresh()
    }
  }

  return (
    <Command
      ref={commandRef}
      className="relative z-50 h-fit w-full overflow-visible rounded-md border"
    >
      <Input
        // disabled={isFetching}
        onChange={e => {
          setInput(e.target.value)
          debounceRequest()
        }}
        value={input}
        placeholder={`Search ${mode}...`}
        disabled={disabled}
        className="border-1"
      />

      {input.length > 0 && (
        <CommandList className="absolute -inset-x-[0.5px] top-full mt-1 rounded-b-md border-x border-b bg-background">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}

          {(results?.anime.length ?? 0) > 0 ? (
            <CommandGroup heading="Anime">
              {results?.anime.map(item => (
                <CommandItem
                  onSelect={() => handleOnClick(item)}
                  key={item.id}
                  value={item.title}
                >
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {(results?.manga.length ?? 0) > 0 ? (
            <CommandGroup heading="Manga">
              {results?.manga.map(item => (
                <CommandItem
                  onSelect={() => handleOnClick(item)}
                  key={item.id}
                  value={item.title}
                >
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {(results?.characters.length ?? 0) > 0 ? (
            <CommandGroup heading="Characters">
              {results?.characters.map(item => (
                <CommandItem
                  onSelect={() => handleOnClick(item)}
                  key={item.id}
                  value={item.name}
                >
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  )
}

export default Search
