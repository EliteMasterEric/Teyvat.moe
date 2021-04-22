import completed from 'src/components/redux/slices/Completed';
import displayed from 'src/components/redux/slices/Displayed';
import editor from 'src/components/redux/slices/Editor';
import error from 'src/components/redux/slices/Error';
import ui from 'src/components/redux/slices/Interface';
import notify from 'src/components/redux/slices/Notify';
import options from 'src/components/redux/slices/Options';

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
