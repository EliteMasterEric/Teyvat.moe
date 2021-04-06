import { Box, IconButton, Tooltip, Typography, makeStyles } from '@material-ui/core';
import { AssignmentTurnedIn as AssignmentTurnedInIcon, Link as LinkIcon } from '@material-ui/icons';
import type { LeafletEvent, LeafletEventHandlerFn } from 'leaflet';
import React, { FunctionComponent } from 'react';
import { Popup } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';

import {
  MSFFeatureExtended,
  MSFFeatureKey,
  MSFMarkerKey,
  YOUTUBE_REGEX,
} from 'src/components/data/Element';
import { localizeField } from 'src/components/i18n/FeatureLocalization';
import { f, formatUnixTimestamp, t } from 'src/components/i18n/Localization';
import { NextImage } from 'src/components/interface/Image';
import { InputSwitch } from 'src/components/interface/Input';
import YouTubeEmbed from 'src/components/interface/YouTubeEmbed';
import { EditorMarker } from 'src/components/preferences/EditorDataSchema';
import { AppDispatch } from 'src/components/redux';
import {
  clearMarkerCompleted,
  selectMarkerCompleted,
  setMarkerCompleted,
} from 'src/components/redux/slices/completed';
import { selectCompletedAlpha } from 'src/components/redux/slices/options';
import { AppState } from 'src/components/redux/types';
import { SafeHTML } from 'src/components/util';
import { ExtendedMarker } from 'src/components/views/map/layers/ExtendedMarker';
import { createClusterIcon, createMapIcon } from 'src/components/views/map/layers/FeatureIcon';
import { copyPermalink } from 'src/components/views/PermalinkHandler';

const useStyles = makeStyles((_theme) => ({
  popupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& p': {
      // Improve specificity.
      margin: 0,
    },
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  innerActionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupContent: {
    fontSize: 12,
  },
  popupMediaImage: {
    margin: '4px 0 4px 0',
    // objectFit: 'cover',
  },
}));

interface FeatureMediaProps {
  media?: string;
  allowExternalMedia: boolean;
}

const FeatureMedia: FunctionComponent<FeatureMediaProps> = ({ media, allowExternalMedia }) => {
  const classes = useStyles();

  if (media == null || media === '') return null;

  const isExternal = media.match(/^http(s):\/\//);

  // An external image or link.
  if (isExternal) {
    // Is this a link to a YouTube video?
    const isYouTube = media.match(YOUTUBE_REGEX);
    if (isYouTube) {
      const match = YOUTUBE_REGEX.exec(media);
      if (match != null) {
        const videoId = match[1];
        if (videoId != null) {
          return <YouTubeEmbed id={videoId} width={560} height={315} />;
        }
      }
    }

    // Else, it's an external image.
    if (allowExternalMedia) {
      // Display external images in the editor,
      // since it is assumed this user submitted it.
      return <img src={media} className={classes.popupMediaImage} />;
    }

    // Prevent displaying external images for security reasons.
    return <span>{media}</span>;
  }

  // Else, use an image from public/comments.
  return (
    <NextImage
      className={classes.popupMediaImage}
      src={`/images/comments/${media}.png`}
      width={192}
      height={192}
    />
  );
};

interface FeatureMarkerBaseProps {
  marker: EditorMarker;
  featureKey: MSFFeatureKey;
  icons: MSFFeatureExtended['icons'] | null;
  editable?: boolean;
  allowExternalMedia?: boolean;
}

const mapStateToProps = (state: AppState, { marker, featureKey }: FeatureMarkerBaseProps) => {
  const markerKey = `${featureKey}/${marker.id}` as MSFMarkerKey;

  return {
    completed: selectMarkerCompleted(state, markerKey),
    completedAlpha: selectCompletedAlpha(state),
  };
};
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { marker, featureKey }: FeatureMarkerBaseProps
) => {
  const markerKey = `${featureKey}/${marker.id}` as MSFMarkerKey;

  return {
    markFeature: () => dispatch(setMarkerCompleted(markerKey)),
    unmarkFeature: () => dispatch(clearMarkerCompleted(markerKey)),
  };
};
type FeatureMarkerStateProps = ReturnType<typeof mapStateToProps>;
type FeatureMarkerDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  FeatureMarkerStateProps,
  FeatureMarkerDispatchProps,
  FeatureMarkerBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type FeatureMarkerProps = ConnectedProps<typeof connector> & FeatureMarkerBaseProps;

const _FeatureMarker: FunctionComponent<FeatureMarkerProps> = ({
  marker,
  featureKey,
  icons,

  completed = undefined,
  completedAlpha,

  editable = false,
  allowExternalMedia = false,

  markFeature,
  unmarkFeature,
}) => {
  // CSS classes.
  const classes = useStyles();

  let svg = false;
  let clusterIconName = '';

  if (completed) {
    // == false sucks, but TypeScript needs it to guarantee
    // the structure of the marker icon data.
    if (icons?.done?.marker == false) {
      svg = icons?.done?.svg ?? false;
      clusterIconName = icons?.done?.clusterIcon ?? '';
    }
  } else {
    if (icons?.base?.marker == false) {
      svg = icons?.base?.svg ?? false;
      clusterIconName = icons?.base?.clusterIcon ?? '';
    }
  }

  // Build the icon for this marker. Relies on completion status.
  const icon = createMapIcon({
    ...(completed ? icons?.done : icons?.base),
    marker: (completed ? icons?.done?.marker : icons?.base?.marker) ?? true,
    done: !!completed,
    ext: svg ? 'svg' : 'png',
    key: (completed ? icons?.done?.key : icons?.base?.key) ?? icons?.filter ?? '',
  });

  // Build the cluster icon for the marker. Also relies on completion status.
  const clusterIcon = createClusterIcon({
    marker: (completed ? icons?.done?.marker : icons?.base?.marker) ?? true,
    ext: svg ? 'svg' : 'png',
    key: (completed ? icons?.done?.key : icons?.base?.key) ?? icons?.filter ?? '',
    clusterIcon: clusterIconName,
  });

  /**
   * Function which is called when the
   * @param event
   */
  const onSingleClick = (event: LeafletEvent) => {
    // Calls on single clicks, not double clicks.

    // Trigger the popup to display only on single clicks.
    event.target.openPopup();
  };

  const onDoubleClick = (_event: LeafletEvent) => {
    // Calls on double clicks, not single clicks.

    // Mark as completed.
    if (completed) {
      unmarkFeature();
    } else {
      markFeature();
    }
  };

  const DOUBLE_CLICK_TIMEOUT = 300;

  const onCopyPermalink = () => copyPermalink(marker.id);

  const onSwitchCompleted = (value: boolean): void => {
    // If we switch to true but the marker is already completed,
    // do nothing.
    if (value === !!completed) return;

    if (value) {
      markFeature();
    } else {
      unmarkFeature();
    }
  };

  /* eslint-disable no-param-reassign */
  const eventHandlers: Record<string, LeafletEventHandlerFn> = {
    add: (event) => {
      // We will be triggering popups manually.
      event.target.off('click', event.target._openPopup);
      if (editable) {
        event.target.enableEdit();
      }
    },
    click: (event) => {
      if (event.target.clicks === undefined) event.target.clicks = 0;

      event.target.clicks += 1;

      setTimeout(() => {
        if (event.target.clicks === 1) {
          onSingleClick(event);
        }
        event.target.clicks = 0;
      }, DOUBLE_CLICK_TIMEOUT);
    },
    dblclick: (event) => {
      event.target.clicks = 0;
      onDoubleClick(event);
    },
  };
  /* eslint-enable no-param-reassign */

  const title = localizeField(marker?.popupTitle);
  const content = localizeField(marker?.popupContent);

  return (
    <ExtendedMarker
      clusterIconUrl={clusterIcon}
      completed={!!completed}
      eventHandlers={eventHandlers}
      icon={icon}
      key={marker.id}
      markerKey={`${featureKey}/${marker.id}`}
      opacity={completed ? completedAlpha : 1}
      position={marker.coordinates}
    >
      {/* A modern variant of MapPopupLegacy. */}
      <Popup maxWidth={540} minWidth={192} autoPan={false} keepInView={false}>
        <Box className={classes.popupContainer}>
          {title && title !== '' ? (
            <Typography className={classes.popupTitle}>{title}</Typography>
          ) : (
            <Typography className={classes.popupTitle}>
              {f('marker-id-format', { id: marker.id.substring(0, 7) })}
            </Typography>
          )}
          <Box>
            <FeatureMedia media={marker.popupMedia} allowExternalMedia={allowExternalMedia} />
          </Box>
          {content && content !== '' ? (
            <SafeHTML className={classes.popupContent}>{content}</SafeHTML>
          ) : null}
          {!editable ? (
            <Box className={classes.actionContainer}>
              <Tooltip title={t('completed')}>
                <Box className={classes.innerActionContainer}>
                  <InputSwitch
                    size="small"
                    color="primary"
                    label={<AssignmentTurnedInIcon />}
                    value={Boolean(completed)}
                    onChange={onSwitchCompleted}
                  />
                </Box>
              </Tooltip>
              <Tooltip title={t('copy-permalink')}>
                <Box className={classes.innerActionContainer}>
                  <IconButton onClick={onCopyPermalink}>
                    <LinkIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          ) : null}
          {completed ? (
            <Typography className={classes.completedSubtitle}>
              {f('completed-time-format', {
                time: formatUnixTimestamp(completed),
              })}
            </Typography>
          ) : null}
        </Box>
      </Popup>
    </ExtendedMarker>
  );
};

const FeatureMarker = connector(_FeatureMarker);

export default FeatureMarker;
