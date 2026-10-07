import { Platform } from 'react-native';

export const LOOP_LEAD = Platform.OS === 'android' ? 0.07 : 1 / 60;

export const MAX_LOOKAHEAD = 0.15;

export const SEEK_SETTLE_MS = 150;

export const RESTART_TOLERANCE = 0.25;
