"use client";

import { ReactNode, useRef } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface DataTableColumn<T> {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id?: string; visible?: boolean }> {
  items: T[];
  columns: DataTableColumn<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onToggleVisible?: (item: T) => void;
  draggable?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export function DataTable<T extends { id?: string; visible?: boolean }>({
  items,
  columns,
  onEdit,
  onDelete,
  onToggleVisible,
  draggable = false,
  onReorder,
}: DataTableProps<T>) {
  const dragIndexRef = useRef<number | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {draggable && <th className="w-8 p-3"></th>}
            {columns.map((col) => (
              <th key={col.header} className="p-3 text-left font-medium text-muted-foreground">
                {col.header}
              </th>
            ))}
            {onToggleVisible && <th className="p-3 text-left font-medium text-muted-foreground">Visible</th>}
            <th className="p-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item, index) => (
            <tr
              key={item.id || index}
              draggable={draggable}
              onDragStart={() => (dragIndexRef.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                const dragIndex = dragIndexRef.current;
                if (dragIndex !== null && onReorder && dragIndex !== index) {
                  onReorder(dragIndex, index);
                }
                dragIndexRef.current = null;
              }}
              className="hover:bg-muted/30"
            >
              {draggable && (
                <td className="cursor-move p-3 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.header} className={`p-3 ${col.className || ""}`}>
                  {col.render(item)}
                </td>
              ))}
              {onToggleVisible && (
                <td className="p-3">
                  <Switch checked={!!item.visible} onCheckedChange={() => onToggleVisible(item)} />
                </td>
              )}
              <td className="p-3">
                <div className="flex items-center justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(item)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(item)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
