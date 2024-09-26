import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function ShimmerTableBody({
  row,
  coloumn,
}: {
  row: number;
  coloumn: number;
}) {
  return (
    <TableBody>
      {Array.from({ length: row }, (_, index) => (
        <TableRow key={index}>
          {Array.from({ length: coloumn }, () => (
            <TableCell className="py-2">
              <Skeleton className="w-20 h-4 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
