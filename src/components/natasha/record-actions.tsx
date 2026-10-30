"use client"

import { useRouter } from "next/navigation"
import { Pencil, Printer, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

/**
 * Edit / Print / Delete for a detail page. `name` reads naturally in copy,
 * e.g. "sale #968" or "product #23".
 */
export function RecordActions({
  name,
  redirectTo,
  printable,
}: {
  name: string
  redirectTo: string
  printable?: boolean
}) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" size="lg" onClick={() => toast(`Editing ${name}`)}>
        <Pencil />
        Edit
      </Button>
      {printable && (
        <Button variant="secondary" size="lg" onClick={() => window.print()}>
          <Printer />
          Print
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="lg">
            <Trash2 />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              It&apos;s removed from your store along with its history. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="secondary" size="lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              size="lg"
              onClick={() => {
                toast.success(`${name.charAt(0).toUpperCase()}${name.slice(1)} deleted`)
                router.push(redirectTo)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
