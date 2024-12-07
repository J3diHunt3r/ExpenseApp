// components/PaginationComponent.tsx
import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const PaginationComponent = ({ currentPage, totalPages, setCurrentPage }: { currentPage: number, totalPages: number, setCurrentPage: React.Dispatch<React.SetStateAction<number>> }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <Pagination>
        <PaginationContent className="flex items-center">
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink href="#" isActive={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
