
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Star, Calendar, User } from 'lucide-react';
import { ContentItem } from '../store/slices/contentSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  item: ContentItem;
  onToggleFavorite: (id: string) => void;
  index: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, onToggleFavorite, index }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-500';
      case 'movie': return 'bg-purple-500';
      case 'social': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return '📰';
      case 'movie': return '🎬';
      case 'social': return '📱';
      default: return '📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
        {item.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge className={`${getTypeColor(item.type)} text-white border-0`}>
                {getTypeIcon(item.type)} {item.type}
              </Badge>
              {item.rating && (
                <Badge variant="secondary" className="bg-yellow-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  {item.rating}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 ${
                item.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-white hover:text-red-400'
              }`}
              onClick={() => onToggleFavorite(item.id)}
            >
              <Heart className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
            </Button>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 dark:text-white">
              {item.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(item.publishedAt)}
            </div>
            {item.author && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {item.author}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-3">
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
            {item.description}
          </p>
          
          <div className="mt-3">
            <Badge variant="outline" className="text-xs capitalize dark:border-gray-600">
              {item.category}
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            {item.url && (
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                asChild
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {item.type === 'movie' ? 'Watch' : item.type === 'social' ? 'View Post' : 'Read More'}
                </a>
              </Button>
            )}
            
            <Button
              variant={item.isFavorite ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite(item.id)}
              className={item.isFavorite ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              <Heart className="w-3 h-3" fill={item.isFavorite ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
