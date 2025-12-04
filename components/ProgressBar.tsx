'use client';

import { differenceInDays } from 'date-fns';
import { Funding } from '@/lib/types';

interface ProgressBarProps {
  funding: Funding;
}

export default function ProgressBar({ funding }: ProgressBarProps) {
  const progress = Math.min((funding.currentAmount / funding.targetAmount) * 100, 100);
  const daysRemaining = differenceInDays(new Date(funding.deadline), new Date());
  const isOverdue = daysRemaining < 0;
  const isCompleted = funding.currentAmount >= funding.targetAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          모금 현황
        </span>
        {funding.transparencySettings.showGoal && (
          <span className="text-gray-500">
            목표: {formatCurrency(funding.targetAmount)}
          </span>
        )}
      </div>
      
      <div className="relative h-6 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-500 ${
            isCompleted
              ? 'bg-gradient-to-r from-pink-500 to-rose-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(funding.currentAmount)}
          </span>
          <span className="text-sm text-gray-500">
            ({progress.toFixed(1)}%)
          </span>
        </div>
        
        <div className={`text-sm font-medium ${
          isOverdue
            ? 'text-red-600'
            : isCompleted
            ? 'text-green-600'
            : 'text-gray-600'
        }`}>
          {isOverdue
            ? '마감됨'
            : isCompleted
            ? '목표 달성!'
            : `${daysRemaining}일 남음`}
        </div>
      </div>
    </div>
  );
}

