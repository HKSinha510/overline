import React from 'react';
import { Check, Clock } from 'lucide-react';
import { cn, formatPrice, formatDuration } from '@/lib/utils';
import type { Service } from '@/types';
import { motion } from 'framer-motion';

interface ServiceListProps {
  services: Service[];
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  selectedServices,
  onToggleService,
}) => {
  const isSelected = (serviceId: string) =>
    selectedServices.some((s) => s.id === serviceId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((service, idx) => {
        const selected = isSelected(service.id);

        return (
          <motion.button
            key={service.id}
            onClick={() => onToggleService(service)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              'relative w-full text-left rounded-3xl p-[2px] overflow-hidden transition-all duration-300',
              selected ? 'shadow-lg' : 'hover:shadow-md'
            )}
          >
            {/* Gradient Border Background */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-300",
              selected ? "bg-gradient-to-br from-lexo-charcoal to-lexo-black opacity-100" : "bg-gray-200 opacity-50"
            )} />

            {/* Inner Content */}
            <div className={cn(
              "relative h-full w-full bg-white rounded-[22px] flex flex-col p-5",
              selected ? "bg-white/95" : ""
            )}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <h4 className={cn("text-lg font-bold transition-colors", selected ? "text-lexo-black" : "text-lexo-charcoal")}>
                    {service.name}
                  </h4>
                  {service.description && (
                    <p className="text-sm text-lexo-gray mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
                    selected
                      ? 'bg-lexo-black border-lexo-black text-white'
                      : 'border-gray-300 text-transparent'
                  )}
                >
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="flex items-center text-sm text-lexo-gray font-medium">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {formatDuration(service.durationMinutes)}
                </span>
                <span className="text-xl font-black text-lexo-black">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export { ServiceList };
