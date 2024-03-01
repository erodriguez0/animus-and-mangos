"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import { ErrorResponse } from "@/types/custom"

interface AddToListToggleProps {
  id: string
  listId: string
  mode: "anime" | "manga" | "character"
  exists: boolean
}

const AddToListToggle = ({
  id,
  listId,
  mode,
  exists,
}: AddToListToggleProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [existsInList, setExistsInList] = useState<boolean>(exists)

  const handleClick = async () => {
    try {
      setLoading(true)

      const res = await fetch(`/api/list/${mode}`, {
        method: "POST",
        body: JSON.stringify({ anime_id: id, list_id: listId }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const { message }: ErrorResponse = await res.json()
        console.log(message)
      }

      setExistsInList(!existsInList)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant={existsInList ? "destructive" : "default"}
      onClick={handleClick}
      disabled={loading}
      className="h-8"
    >
      {existsInList ? "Remove" : "Add"}
    </Button>
  )
}

export default AddToListToggle
