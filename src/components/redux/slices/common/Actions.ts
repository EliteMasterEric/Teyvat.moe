import { CoreAction } from 'src/components/redux/slices/common/core/Actions';
import { I18nAction } from 'src/components/redux/slices/common/i18n/Actions';
import { NotifyAction } from 'src/components/redux/slices/common/notify/Actions';

export type CommonAction = CoreAction | I18nAction | NotifyAction;
