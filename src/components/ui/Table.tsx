import React, { useState } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  isMono?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  keyExtractor?: (row: T, index: number) => string | number;
  emptyState?: React.ReactNode;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  keyExtractor,
  emptyState = 'No data available',
  className = '',
  ...props
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    if (sortKey === column.key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(column.key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      const result = valA < valB ? -1 : 1;
      return sortDirection === 'asc' ? result : -result;
    });
  }, [data, sortKey, sortDirection]);

  return (
    <div className="w-full overflow-x-auto border border-white/10 rounded-2xl bg-[#131317]">
      <table className={`w-full text-left border-collapse ${className}`} {...props}>
        <thead>
          <tr className="border-b border-white/10 bg-[#050508]/60">
            {columns.map((col) => {
              const alignClass =
                col.align === 'center'
                  ? 'text-center'
                  : col.align === 'right'
                  ? 'text-right'
                  : 'text-left';

              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  style={{ width: col.width }}
                  className={`p-4 text-xs font-sans font-medium uppercase tracking-[0.04em] text-[#9ca3af] select-none ${alignClass} ${
                    col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="flex flex-col text-[10px] leading-none text-[#9ca3af]">
                        <span
                          className={
                            sortKey === col.key && sortDirection === 'asc'
                              ? 'text-[#c0f500] font-bold'
                              : 'opacity-40'
                          }
                        >
                          ▲
                        </span>
                        <span
                          className={
                            sortKey === col.key && sortDirection === 'desc'
                              ? 'text-[#c0f500] font-bold'
                              : 'opacity-40'
                          }
                        >
                          ▼
                        </span>
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-sm text-[#9ca3af] font-mono">
                {emptyState}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => {
              const key = keyExtractor ? keyExtractor(row, index) : row.id || index;

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors hover:bg-[#1f1f23] ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left';

                    const fontClass = col.isMono
                      ? 'font-mono text-[13px] text-[#00e3fd]'
                      : 'font-sans text-sm text-white';

                    const value = col.accessor ? col.accessor(row) : row[col.key];

                    return (
                      <td key={col.key} className={`p-4 ${fontClass} ${alignClass}`}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
