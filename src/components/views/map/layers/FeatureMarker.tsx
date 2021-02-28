import { Box, IconButton, Tooltip, Typography, makeStyles } from '@material-ui/core';
import { AssignmentTurnedIn as AssignmentTurnedInIcon, Link as LinkIcon } from '@material-ui/icons';
import type { LeafletEventHandlerFn } from 'leaflet';
import React from 'react';
import { Popup } from 'react-leaflet';
import { connect } from 'react-redux';

import { YOUTUBE_REGEX } from '~/components/data/ElementSchema';
import { createClusterIcon, createMapIcon } from '~/components/data/FeatureIcon';
import { f, formatUnixTimestamp, t } from '~/components/i18n/Localization';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import { Image, useImageExtension } from '~/components/interface/Image';
import { InputSwitch } from '~/components/interface/Input';
import YouTubeEmbed from '~/components/interface/YouTubeEmbed';
import {
  clearFeatureMarkerCompleted,
  setFeatureMarkerCompleted,
} from '~/components/redux/ducks/completed';
import { SafeHTML } from '~/components/Util';
import { ExtendedMarker } from '~/components/views/map/layers/ExtendedMarker';
import { copyPermalink } from '~/components/views/PermalinkHandler';

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
    width: 192,
    height: 192,
  },
}));

const FeatureMedia = ({ media, allowExternalMedia }) => {
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
        return <YouTubeEmbed id={videoId} width={560} height={315} />;
      }
    }

    // Else, it's an external image.
    if (allowExternalMedia) {
      // Display external images in the editor,
      // since it is assumed this user submitted it.
      return <Image srcPNG={media} className={classes.popupMediaImage} />;
    }

    // Prevent displaying external images for security reasons.
    return <span>{media}</span>;
  }

  // Else, use an image from public/comments.
  return (
    <Image
      className={classes.popupMediaImage}
      srcPNG={`/comments/${media}.png`}
      srcWebP={`/comments/${media}.webp`}
    />
  );
};

const _FeatureMarker = ({
  marker,
  featureKey,
  icons,

  completed,
  completedAlpha,

  editable = false,
  allowExternalMedia = false,

  markFeature,
  unmarkFeature,
}) => {
  // CSS classes.
  const classes = useStyles();

  // WebP or PNG, based on support.
  const ext = useImageExtension(true);

  // Don't render the marker until we know whether to use WebP for the image or not.
  if (!ext) return null;

  // Build the icon for this marker. Relies on completion status.
  const icon = createMapIcon({
    ...(completed ? icons?.done : icons?.base),
    ext: (completed ? icons?.done?.svg : icons?.base?.svg) ?? false ? 'svg' : ext,
    key: (completed ? icons?.done?.key : icons?.base?.key) ?? icons?.filter,
    completed,
  });

  // Build the cluster icon for the marker. Also relies on completion status.
  const clusterIcon = createClusterIcon({
    ...(completed ? icons?.done : icons?.base),
    ext: (completed ? icons?.done?.svg : icons?.base?.svg) ?? false ? 'svg' : ext,
    key: (completed ? icons?.done?.key : icons?.base?.key) ?? icons?.filter,
    completed,
  });

  /**
   * Function which is called when the
   * @param event
   */
  const onSingleClick = (event) => {
    // Calls on single clicks, not double clicks.

    // Trigger the popup to display only on single clicks.
    event.target.openPopup();
  };

  const onDoubleClick = (_event) => {
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

  const onSwitchCompleted = (value) => {
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

  const title = localizeField(marker.popupTitle);
  const content = localizeField(marker.popupContent);

  return (
    <ExtendedMarker
      clusterIconUrl={clusterIcon}
      completed={!!completed}
      eventHandlers={eventHandlers}
      icon={icon}
      key={marker.id}
      markerKey={`${featureKey}/${marker.id}`}
      opacity={completed ? completedAlpha : 1}
      position={marker?.coordinates}
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

const mapStateToProps = ({ options, completed }, { marker, featureKey }) => {
  const key = `${featureKey}/${marker.id}`;

  return {
    completed: completed.features[key] ?? false,
    completedAlpha: options.completedAlpha,
  };
};
const mapDispatchToProps = (dispatch, { marker, feature }) => {
  const key = `${feature.key}/${marker.id}`;

  return {
    markFeature: () => dispatch(setFeatureMarkerCompleted(key)),
    unmarkFeature: () => dispatch(clearFeatureMarkerCompleted(key)),
  };
};
const FeatureMarker = connect(mapStateToProps, mapDispatchToProps)(_FeatureMarker);

export default FeatureMarker;
