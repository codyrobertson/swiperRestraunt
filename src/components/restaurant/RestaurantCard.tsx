import * as React from 'react';
import { memo } from 'react';
import { StyleSheet } from 'react-nativescript';
import { Image } from '@nativescript/core';
import { Restaurant } from '../../types/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onTap?: () => void;
}

export const RestaurantCard = memo(({ restaurant, onTap }: RestaurantCardProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <gridLayout 
      rows="*, auto" 
      className="bg-white rounded-xl shadow-lg m-4 overflow-hidden"
      onTap={onTap}
    >
      <gridLayout row={0} className="h-64">
        {!imageLoaded && (
          <activityIndicator
            busy={true}
            className="h-64"
          />
        )}
        <image
          src={restaurant.imageUrl}
          stretch="aspectFill"
          className={`h-64 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loaded={handleImageLoaded}
        />
      </gridLayout>

      <stackLayout row={1} className="p-4">
        <flexboxLayout className="justify-between items-center">
          <label className="text-xl font-bold">{restaurant.name}</label>
          {restaurant.price && (
            <label className="text-gray-600">{'$'.repeat(restaurant.price)}</label>
          )}
        </flexboxLayout>
        
        <label className="text-gray-600">{restaurant.cuisine}</label>
        
        {restaurant.rating > 0 && (
          <flexboxLayout className="mt-2">
            <label className="text-yellow-500">{'★'.repeat(restaurant.rating)}</label>
            <label className="text-gray-300">{'★'.repeat(5 - restaurant.rating)}</label>
          </flexboxLayout>
        )}
        
        <label className="text-gray-500 mt-2">{restaurant.address}</label>
        
        {restaurant.reserveUrl && (
          <button
            className="bg-blue-500 text-white p-2 rounded-lg mt-2"
            text="Reserve Table"
            onTap={(args) => {
              args.object.ios && args.object.ios.preventTap();
              // TODO: Implement reservation URL handling
            }}
          />
        )}
      </stackLayout>
    </gridLayout>
  );
}, (prevProps, nextProps) => {
  return prevProps.restaurant.id === nextProps.restaurant.id;
});