import completed from '~/components/redux/slices/completed';
import displayed from '~/components/redux/slices/displayed';
import editor from '~/components/redux/slices/editor';
import error from '~/components/redux/slices/error';
import notify from '~/components/redux/slices/notify';
import options from '~/components/redux/slices/options';
import ui from '~/components/redux/slices/ui';

const slicesReducer = {
  completed,
  displayed,
  editor,
  error,
  notify,
  options,
  ui,
};

export default slicesReducer;
