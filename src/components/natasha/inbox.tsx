"use client"

import * as React from "react"
import {
  ArchiveX,
  BellOff,
  ChevronDown,
  ChevronLeft,
  ListFilter,
  MailOpen,
  Paperclip,
  Phone,
  Plus,
  Search,
  SendHorizontal,
  Smile,
  Trash2,
  UserPlus,
  UserRound,
  Video,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { currentUser, type ChatMessage, type Conversation } from "@/lib/natasha/data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UserAvatar } from "@/components/natasha/user-avatar"

type Filter = "all" | "unread" | "online"

const replies = [
  "Thanks! That's really helpful.",
  "Got it — I'll keep an eye out for the email.",
  "Perfect, talk soon!",
  "Amazing, thank you so much 🙌",
]

function ago(minutes: number) {
  return minutes < 1 ? "Just now" : `${minutes} min ago`
}

export function Inbox({ initial }: { initial: Conversation[] }) {
  const [threads, setThreads] = React.useState(initial)
  const [activeId, setActiveId] = React.useState("bradley")
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<Filter>("all")
  const [showThread, setShowThread] = React.useState(false)
  const [typing, setTyping] = React.useState<string | null>(null)

  const active = threads.find((t) => t.id === activeId) ?? threads[0]
  const visible = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (filter === "all" || (filter === "unread" ? t.unread > 0 : t.online))
  )

  function open(id: string) {
    setActiveId(id)
    setShowThread(true)
    setThreads((list) => list.map((t) => (t.id === id ? { ...t, unread: 0 } : t)))
  }

  function update(id: string, change: (t: Conversation) => Conversation) {
    setThreads((list) => list.map((t) => (t.id === id ? change(t) : t)))
  }

  function send(text: string) {
    const id = active.id
    const message: ChatMessage = { id: crypto.randomUUID(), from: "me", text, minutesAgo: 0 }
    update(id, (t) => ({ ...t, messages: [...t.messages, message], preview: text, minutesAgo: 0 }))

    // Simulated reply so the demo feels alive.
    setTyping(id)
    window.setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)]
      update(id, (t) => ({
        ...t,
        messages: [...t.messages, { id: crypto.randomUUID(), from: "them", text: reply, minutesAgo: 0 }],
        preview: reply,
      }))
      setTyping((current) => (current === id ? null : current))
    }, 1600)
  }

  return (
    <Card className="h-[calc(100dvh-148px)] min-h-[560px] flex-row gap-0 py-0">
      {/* Conversation list */}
      <aside
        className={cn(
          "relative flex w-full min-w-0 flex-col border-border lg:w-110 lg:shrink-0 lg:border-r",
          showThread && "max-lg:hidden"
        )}
      >
        <div className="flex h-25 shrink-0 items-center gap-4 border-b border-border px-6">
          <label className="relative flex-1">
            <span className="sr-only">Search chats</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a chat…"
              className="h-11 w-full rounded-lg border border-input bg-secondary pr-4 pl-12 type-body-lg outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25"
            />
          </label>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon-lg" aria-label="Filter chats" className="relative">
                    <ListFilter />
                    {filter !== "all" && <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Filter</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="type-overline text-muted-foreground">Show</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                <DropdownMenuRadioItem value="all">All chats</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unread">Unread</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="online">Online</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ul className="no-scrollbar min-h-0 flex-1 overflow-y-auto scroll-fade-b pb-20">
          {visible.map((thread) => (
            <li key={thread.id}>
              <button
                type="button"
                onClick={() => open(thread.id)}
                aria-current={thread.id === active.id ? "true" : undefined}
                className={cn(
                  "relative flex h-20 w-full items-center gap-4 px-6 text-left outline-none transition-colors hover:bg-secondary/50 focus-visible:bg-secondary",
                  "before:absolute before:right-6 before:bottom-0 before:left-22 before:h-px before:bg-border",
                  thread.id === active.id && "bg-secondary hover:bg-secondary",
                  thread.unread > 0 && "after:absolute after:inset-y-0 after:right-0 after:w-0.5 after:bg-primary"
                )}
              >
                <UserAvatar seed={thread.name} color={thread.avatarColor} online={thread.online} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate type-body-lg font-semibold">{thread.name}</span>
                    <span className="shrink-0 type-micro text-subtle-foreground">
                      {thread.minutesAgo < 1 ? "now" : `${thread.minutesAgo}min`}
                    </span>
                  </span>
                  {thread.unread > 0 ? (
                    <span className="type-caption text-primary-light">
                      {thread.unread} New message{thread.unread > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="truncate type-caption text-muted-foreground">{thread.preview}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
          {visible.length === 0 && <li className="px-6 py-12 text-center type-body text-muted-foreground">No chats found.</li>}
        </ul>

        <Button size="lg" className="absolute right-6 bottom-6 shadow-lg shadow-black/40" onClick={() => toast("Pick someone to start a new chat")}>
          <Plus />
          New chat
        </Button>
      </aside>

      {/* Thread */}
      <section className={cn("flex min-w-0 flex-1 flex-col", !showThread && "max-lg:hidden")} aria-label={`Chat with ${active.name}`}>
        <header className="flex h-25 shrink-0 items-center gap-3 border-b border-border px-4 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Back to chats" onClick={() => setShowThread(false)}>
            <ChevronLeft />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group/name flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <span className="truncate type-title-lg md:type-display">{active.name}</span>
                <ChevronDown className="size-6 shrink-0 text-muted-foreground transition-transform group-aria-expanded/name:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => toast(`Opening ${active.name}'s profile`)}>
                <UserRound /> View profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast(`Muted ${active.name}`)}>
                <BellOff /> Mute notifications
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => update(active.id, (t) => ({ ...t, unread: 1 }))}>
                <MailOpen /> Mark as unread
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast(`Archived chat with ${active.name}`)}>
                <ArchiveX /> Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border-subtle" />
              <DropdownMenuItem variant="destructive" onSelect={() => update(active.id, (t) => ({ ...t, messages: [] }))}>
                <Trash2 /> Clear history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="ml-auto flex items-center gap-3">
            <HeaderAction label="Add to contacts" onClick={() => toast.success(`${active.name} added to contacts`)}>
              <UserPlus />
            </HeaderAction>
            <HeaderAction label="Voice call" onClick={() => toast(`Calling ${active.name}…`)}>
              <Phone />
            </HeaderAction>
            <HeaderAction label="Video call" variant="default" onClick={() => toast(`Starting video with ${active.name}…`)}>
              <Video />
            </HeaderAction>
          </div>
        </header>

        <MessageList key={active.id} thread={active} typing={typing === active.id} />
        <Composer key={`composer-${active.id}`} onSend={send} name={active.name} />
      </section>
    </Card>
  )
}

function HeaderAction({
  label,
  variant = "secondary",
  onClick,
  children,
}: {
  label: string
  variant?: "secondary" | "default"
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} size="icon-lg" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/* Messages ----------------------------------------------------------------- */

function MessageList({ thread, typing }: { thread: Conversation; typing: boolean }) {
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [thread.messages.length, typing])

  return (
    <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto scroll-fade-y px-4 py-6 md:px-6" role="log" aria-live="polite">
      <ol className="flex flex-col gap-6">
        {thread.messages.map((message) => (
          <li key={message.id} className={cn("flex items-end gap-4", message.from === "me" && "flex-row-reverse")}>
            {message.from === "me" && (
              <UserAvatar seed={currentUser.avatarSeed} color={currentUser.avatarColor} className="max-md:hidden" />
            )}
            <div
              className={cn(
                "flex max-w-[min(32rem,80%)] flex-col gap-2 rounded-xl border px-4 py-3",
                message.from === "me"
                  ? "border-primary-border bg-primary-soft text-foreground"
                  : "border-border bg-secondary text-foreground"
              )}
            >
              <p className="type-body-lg text-pretty">{message.text}</p>
              <span className={cn("type-micro", message.from === "me" ? "text-primary-light" : "text-subtle-foreground")}>
                {ago(message.minutesAgo)}
              </span>
            </div>
          </li>
        ))}
        {thread.messages.length === 0 && (
          <li className="py-16 text-center type-body text-muted-foreground">No messages yet. Say hello 👋</li>
        )}
        {typing && (
          <li className="flex" aria-label={`${thread.name} is typing`}>
            <span className="flex h-11 items-center gap-1 rounded-xl border border-border bg-secondary px-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
          </li>
        )}
      </ol>
      <div ref={endRef} />
    </div>
  )
}

/* Composer ----------------------------------------------------------------- */

function Composer({ onSend, name }: { onSend: (text: string) => void; name: string }) {
  const [draft, setDraft] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft("")
  }

  return (
    <form onSubmit={submit} className="flex h-19 shrink-0 items-center gap-3 border-t border-border px-4 md:px-6">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full"
        aria-label="Insert emoji"
        onClick={() => {
          setDraft((d) => `${d}🙂`)
          inputRef.current?.focus()
        }}
      >
        <Smile />
      </Button>
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Type a reply…"
        aria-label={`Message ${name}`}
        className="h-11 min-w-0 flex-1 bg-transparent type-body-lg outline-none placeholder:text-muted-foreground"
      />
      <Button type="button" variant="secondary" size="icon" aria-label="More options" className="max-sm:hidden" onClick={() => toast("Quick replies coming soon")}>
        <Plus />
      </Button>
      <Button type="button" variant="secondary" size="icon" aria-label="Attach a file" onClick={() => fileRef.current?.click()}>
        <Paperclip />
      </Button>
      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onSend(`📎 ${file.name}`)
          event.target.value = ""
        }}
      />
      <Button type="submit" size="icon" aria-label="Send message" disabled={!draft.trim()}>
        <SendHorizontal />
      </Button>
    </form>
  )
}
