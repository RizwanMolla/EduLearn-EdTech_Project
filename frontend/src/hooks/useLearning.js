import { useContext } from 'react';
import { LearningContext } from '../context/contexts';

export const useLearning = () => useContext(LearningContext);
