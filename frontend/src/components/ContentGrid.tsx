
import React, { useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ContentCard } from './ContentCard';
import { ContentItem } from '../store/slices/contentSlice';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface ContentGridProps {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  onToggleFavorite: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  items,
  loading,
  error,
  onToggleFavorite,
  onReorder,
  onLoadMore,
  hasMore = false,
  title,
  emptyMessage = "No content available",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use infinite scroll hook when onLoadMore is provided
  useInfiniteScroll(containerRef, {
    hasMore,
    loading,
    onLoadMore: onLoadMore || (() => {}),
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    onReorder(result.source.index, result.destination.index);
  };

  if (error) {
    return (
      <Alert className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">{emptyMessage}</p>
          <p className="text-sm">Try adjusting your preferences or search terms</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="space-y-6 max-h-screen overflow-y-auto"
    >
      {title && (
        <div className="flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-grid">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4' : ''
              }`}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-transform duration-200 ${
                        snapshot.isDragging ? 'rotate-3 scale-105 z-50' : ''
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                        ...(snapshot.isDragging && {
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }),
                      }}
                    >
                      <ContentCard
                        item={item}
                        onToggleFavorite={onToggleFavorite}
                        index={index}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Loading More Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more content...</span>
          </div>
        </div>
      )}

      {/* End of Content Message */}
      {!hasMore && !loading && items.length > 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>You've reached the end of the content</p>
        </div>
      )}
    </div>
  );
};
