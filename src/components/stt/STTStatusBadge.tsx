// src/components/stt/STTStatusBadge.tsx
import React from 'react';
import { useTheme } from 'react-native-paper';
import StatusBadge from '../common/StatusBadge';
import { getSTTStatusColor, getSTTStatusLabel } from '../../utils/formatters/statusFormatter';

interface STTStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const STTStatusBadge: React.FC<STTStatusBadgeProps> = ({
  status,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  return (
    <StatusBadge
      status={status}
      getStatusColor={getSTTStatusColor}
      getStatusLabel={getSTTStatusLabel}
      size={size}
      style={style}
    />
  );
};

export default STTStatusBadge;