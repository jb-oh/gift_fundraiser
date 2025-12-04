import { OccasionType, Funding } from './types';

export const occasionLabels: Record<OccasionType, string> = {
  birthday: '생일',
  wedding: '결혼',
  graduation: '졸업',
  baby: '출산',
  housewarming: '집들이',
  retirement: '퇴직',
  other: '기타',
};

export function getOccasionLabel(funding: Funding): string {
  if (funding.occasion === 'other' && funding.customOccasion) {
    return funding.customOccasion;
  }
  return occasionLabels[funding.occasion] || '선물';
}
