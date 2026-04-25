import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: number } | undefined;
  TaskDetail: { taskId: number };
};

export type TaskListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;
export type TaskFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskForm'>;
export type TaskDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;

export type TaskFormRouteProp = RouteProp<RootStackParamList, 'TaskForm'>;
export type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
