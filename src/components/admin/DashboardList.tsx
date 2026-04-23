"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PortfolioPiece } from "@/lib/types";
import { reorderPiecesAction, deletePieceAction } from "@/app/admin/actions";

type Props = { pieces: PortfolioPiece[] };

export default function DashboardList({ pieces }: Props) {
  const [items, setItems] = useState(pieces);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep local state in sync if the server prop changes (e.g. after a refetch).
  useEffect(() => {
    setItems(pieces);
  }, [pieces]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    setSavingOrder(true);
    setError(null);

    const result = await reorderPiecesAction(next.map((p) => p.id));
    setSavingOrder(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-accent-deep">
          {error}
        </p>
      )}
      {savingOrder && (
        <p className="mb-4 text-xs uppercase tracking-[0.22em] text-ink/50">
          Saving new order…
        </p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ul className="divide-y divide-ink/10 overflow-hidden rounded-sm border border-ink/10 bg-bone">
            {items.map((piece) => (
              <SortableRow key={piece.id} piece={piece} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableRow({ piece }: { piece: PortfolioPiece }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: piece.id });
  const [pending, start] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  function onDelete() {
    if (!confirm(`Delete "${piece.title}"? This can't be undone.`)) return;
    start(async () => {
      await deletePieceAction(piece.id);
    });
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 px-4 py-3 md:gap-6 md:px-6 md:py-4"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab select-none text-ink/40 hover:text-ink active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <DragHandleIcon />
      </button>

      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-ink/10 md:h-16 md:w-20">
        {piece.thumbnail_url || piece.image_url ? (
          <Image
            src={piece.thumbnail_url || piece.image_url}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight">{piece.title}</p>
        <p className="mt-0.5 text-xs text-ink/55">
          {[piece.category, piece.year].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Link
          href={`/admin/edit/${piece.id}`}
          className="text-ink/80 underline underline-offset-4 hover:text-ink"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="text-accent-deep underline underline-offset-4 hover:text-accent disabled:opacity-50"
        >
          {pending ? "…" : "Delete"}
        </button>
      </div>
    </li>
  );
}

function DragHandleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <circle cx="7" cy="5" r="1.4" />
      <circle cx="13" cy="5" r="1.4" />
      <circle cx="7" cy="10" r="1.4" />
      <circle cx="13" cy="10" r="1.4" />
      <circle cx="7" cy="15" r="1.4" />
      <circle cx="13" cy="15" r="1.4" />
    </svg>
  );
}
