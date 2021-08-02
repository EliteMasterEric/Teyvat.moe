import { AchievementsAction } from 'src/components/redux/slices/achievements/Actions';
import { CommonAction } from 'src/components/redux/slices/common/Actions';
import { MapAction } from 'src/components/redux/slices/map/Actions';

export type AppAction = CommonAction | MapAction | AchievementsAction;
