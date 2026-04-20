/**
 * Branded Table Component
 * Provides Virima-themed table styling with responsive behavior
 */

import React from "react";
import { ScrollArea } from "./scroll-area";

interface BrandedTableProps {
  children: React.ReactNode;
  className?: string;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  maxHeight?: string;
}

/**
 * Branded Table Wrapper
 * Automatically applies Virima brand styling to tables
 */
export function BrandedTable({ 
  children, 
  className = "",
  stickyHeader = true,
  stickyFirstColumn = false,
  maxHeight = "600px"
}: BrandedTableProps) {
  return (
    <div className={`branded-table-wrapper ${className}`}>
      <ScrollArea 
        className={`w-full rounded-lg border border-slate-200`}
        style={{ maxHeight }}
      >
        <div className="overflow-x-auto">
          <table className={`branded-table ${stickyHeader ? 'sticky-header' : ''} ${stickyFirstColumn ? 'sticky-first-column' : ''}`}>
            {children}
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * Simple inline table for MDX content
 * Use this directly in .md files
 */
export function VirimaTable({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="virima-table-container my-6">
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className={`virima-table ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
}

/**
 * Table components for direct use
 */
export function TableHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <thead className={`virima-table-header ${className}`}>{children}</thead>;
}

export function TableBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tr className={`virima-table-row ${className}`}>{children}</tr>;
}

export function TableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`virima-table-th ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`virima-table-td ${className}`}>{children}</td>;
}

/**
 * Example Usage:
 * 
 * ```tsx
 * <BrandedTable>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Column 1</TableHead>
 *       <TableHead>Column 2</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Data 1</TableCell>
 *       <TableCell>Data 2</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </BrandedTable>
 * ```
 * 
 * Or in MDX:
 * 
 * ```mdx
 * <VirimaTable>
 *   <thead>
 *     <tr>
 *       <th>Column 1</th>
 *       <th>Column 2</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Data 1</td>
 *       <td>Data 2</td>
 *     </tr>
 *   </tbody>
 * </VirimaTable>
 * ```
 */
