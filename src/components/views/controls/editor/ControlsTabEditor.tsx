/**
 * Provides the interface for the Editor tab in the Map controls.
 */

import { Button, Typography, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import newGithubIssueUrl from 'new-github-issue-url';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { TabView } from 'src/components/interface/Tabs';
import {
  EditorFeatureSubmission,
  EditorMarker,
  EditorRoute,
} from 'src/components/preferences/EditorDataSchema';
import { AppDispatch } from 'src/components/redux';
import { clearElements, selectEditorFeatureData } from 'src/components/redux/slices/Editor';
import { selectIsTabDisplayed, setTab } from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import { generatePrettyJSON, openURLInWindow, setBrowserClipboard } from 'src/components/util';
import ControlsEditorMarker from 'src/components/views/controls/editor/ControlsEditorMarker';
import ControlsEditorRoute from 'src/components/views/controls/editor/ControlsEditorRoute';
import ClearEditorDataPopup from 'src/components/views/dialogs/ClearEditorDataPopup';
import SubmitEditorDataPopup from 'src/components/views/dialogs/SubmitEditorDataPopup';
import ComponentErrorHandler from 'src/components/views/error/ComponentErrorHandler';
import { handleError } from 'src/components/views/error/ErrorHandler';

const useStyles = makeStyles((_theme) => ({
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
}));

interface ControlsEditorElementsProps {
  elements: (EditorMarker | EditorRoute)[];
}

const ControlsEditorElements = handleError<ControlsEditorElementsProps>(({ elements }) => {
  return (
    <BorderBox direction="column" overflow="hidden auto">
      {_.map(elements, (element, _index) => {
        // If the first element is an array, rather than a coordinate,
        // we have a set of multiple points in a route.
        const isRoute = _.isArray(element.coordinates[0]);

        if (isRoute) {
          // Safe to cast here.
          const route = element as EditorRoute;
          return <ControlsEditorRoute key={element.id} route={route} />;
        } else {
          // Safe to cast here.
          const marker = element as EditorMarker;
          return <ControlsEditorMarker key={element.id} marker={marker} />;
        }
      })}
    </BorderBox>
  );
}, ComponentErrorHandler('editor'));

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'elements'),
  editorFeatureData: selectEditorFeatureData(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  resetTab: () => dispatch(setTab('help')),
  clearEditorData: () => dispatch(clearElements()),
});
type ControlsTabEditorStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabEditorDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsTabEditorStateProps,
  ControlsTabEditorDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsTabEditorProps = ConnectedProps<typeof connector>;

const _ControlsTabEditor: FunctionComponent<ControlsTabEditorProps> = ({
  displayed,
  editorFeatureData,
  resetTab,
  clearEditorData,
}) => {
  const classes = useStyles();

  const submitEditorData = async (formData: EditorFeatureSubmission) => {
    const dataObject = {
      ...formData,
      data: editorFeatureData,
    };

    const jsonData = generatePrettyJSON(dataObject);

    const _result = await setBrowserClipboard(jsonData);

    const url = newGithubIssueUrl({
      user: 'genshinmap',
      repo: 'genshinmap.github.io',
      title: `[EDITOR] ${formData.name.en}`,
      labels: ['mapping'],
      body: `The following data was generated by this user using the Editor mode. Any required images should be uploaded to this issue by dragging and dropping.\n\`\`\`\nTHE EDITOR DATA SHOULD BE IN YOUR CLIPBOARD NOW. PASTE IT HERE.\n\`\`\``,
    });

    openURLInWindow(url);
  };

  return (
    <TabView displayed={displayed}>
      <Typography className={classes.header}>{t('editor-elements')}</Typography>
      <Typography className={classes.subtitle}>{t('editor-elements-subtitle')}</Typography>
      <ControlsEditorElements elements={editorFeatureData} />
      <ClearEditorDataPopup
        trigger={
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('clear-editor-data')}
            tabIndex={0}
          >
            {t('clear-editor-data')}
          </Button>
        }
        onConfirm={() => {
          clearEditorData();
          resetTab();
        }}
      />

      <SubmitEditorDataPopup
        trigger={
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('submit-editor-data')}
            tabIndex={0}
          >
            {t('submit-editor-data')}
          </Button>
        }
        onConfirm={submitEditorData}
      />
    </TabView>
  );
};

const ControlsTabEditor = connector(_ControlsTabEditor);

export default ControlsTabEditor;
