import completed from 'src/components/redux/slices/completed';
import displayed from 'src/components/redux/slices/displayed';
import editor from 'src/components/redux/slices/editor';
import error from 'src/components/redux/slices/error';
import notify from 'src/components/redux/slices/notify';
import options from 'src/components/redux/slices/options';
import ui from 'src/components/redux/slices/ui';

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
